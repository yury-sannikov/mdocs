import _ from 'lodash';
import {YELP_CONSUMER_KEY, YELP_CONSUMER_SECRET, YELP_TOKEN, YELP_TOKEN_SECRET} from './config';
import { queryUnprocessed$, saveRecord$ } from './db';
import Yelp from 'yelp';
import { fuzzyMatch } from './fuzzyMatch';
import md5 from 'md5';

const yelp = new Yelp({
  consumer_key: YELP_CONSUMER_KEY,
  consumer_secret: YELP_CONSUMER_SECRET,
  token: YELP_TOKEN,
  token_secret: YELP_TOKEN_SECRET
});

let limit = 50;

function* processNext(limit, rkey) {
  const res = yield queryUnprocessed$(limit, rkey);
  const data = res.data;

  if (!res.key) {
    return null;
  }
  const yelpData = yield data.map( (rec) => {
    return {
      yelp: yelp.phoneSearch({phone: rec.phone}),
      rec
    };
  });
  const yelpDataMassaged = yelpData.map( (data) => {
    const businesses = data.yelp.businesses
      .filter( b => b.is_closed === false)
      .map( b => {
        return Object.assign({}, b, {
          fuzzyMatch: fuzzyMatch(data.rec.fullname, b.name)
        })
      })
      .sort( (a, b) => b.fuzzyMatch.compositeIndex - a.fuzzyMatch.compositeIndex );
    const yelpData = Object.assign({}, data.yelp, { businesses })
    return Object.assign({}, data, {
      yelp: yelpData,
      rec: data.rec
    });

  });

  yield yelpDataMassaged.map( (data) => {
      const yelpBusiness = _.isEmpty(data.yelp.businesses) ? {} : data.yelp.businesses[0];

      let newData = Object.assign({}, data.rec, {
        yelpBusinessId: yelpBusiness.id || '-',
        yelpBusinessIdMatchScore: (yelpBusiness.fuzzyMatch || {}).compositeIndex || 0,
        yelpBusinessRate: yelpBusiness.rating || 0,
        yelpBusinessReviewHash: md5(yelpBusiness.snippet_text || '-'),
        yelpBusiness,
        yelp: data.yelp
      });
      delete newData.fullname;
      return saveRecord$(data.rec.fullname, newData);
  });
  console.log(JSON.stringify(yelpDataMassaged, null, 2))
  return res.key;
}

export default function*() {

  let resumeKey = null;
  do {
    console.log(`Processing with limit ${limit}`);
    resumeKey = yield processNext(limit, resumeKey);
    if (!resumeKey) {
      return 'Done';
    }
  } while(true)

}
