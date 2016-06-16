import _ from 'lodash';
import {YELP_CONSUMER_KEY, YELP_CONSUMER_SECRET, YELP_TOKEN, YELP_TOKEN_SECRET} from './config';
import { queryUnprocessed } from './db';
import Yelp from 'yelp';

const yelp = new Yelp({
  consumer_key: YELP_CONSUMER_KEY,
  consumer_secret: YELP_CONSUMER_SECRET,
  token: YELP_TOKEN,
  token_secret: YELP_TOKEN_SECRET
});


export default function*(params) {
  const data = yield queryUnprocessed();

  if (!data) {
    return 'Done';
  }
  const yelpData = yield data.map( (rec) => {
    return yelp.phoneSearch({phone: rec.phone});
  });
  const yelpDataMassaged = yelpData.map( (data) => {
    const businesses = data.businesses.filter( b => b.is_closed === false);
    return Object.assign({}, data, { businesses })
  });

  return JSON.stringify(yelpDataMassaged, null, 2);
}
