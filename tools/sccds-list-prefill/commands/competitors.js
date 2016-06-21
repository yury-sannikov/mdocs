import _ from 'lodash';
import {YELP_CONSUMER_KEY, YELP_CONSUMER_SECRET, YELP_TOKEN, YELP_TOKEN_SECRET} from '../config';
import { queryUnprocessed$, saveRecord$, queryAvailable$ } from '../db';
import Yelp from 'yelp';
import { fuzzyMatch } from '../fuzzyMatch';
import md5 from 'md5';
import jsonfile from 'jsonfile';

const yelp = new Yelp({
  consumer_key: YELP_CONSUMER_KEY,
  consumer_secret: YELP_CONSUMER_SECRET,
  token: YELP_TOKEN,
  token_secret: YELP_TOKEN_SECRET
});

const limit = 5;
const MINIMUM_MATCH_SCORE = 0.75;
const COMPETITORS_RADIUS_KILOMETERS = 5 * 1600;

function* updateDynamoData(data, yelpCompetitors) {
  let newData = Object.assign({}, data, {
    yelpCompetitors,
    yelpCompetitorsUpdated: +new Date()
  });
  delete newData.fullname;
  yield saveRecord$(data.fullname, newData);
}

function* processNextCheck(limit, rkey) {
  const res = yield queryAvailable$(limit, rkey);
  const data = res.data;

  console.log(`Processing ${data.length} items`);

  if (!res.key) {
    return null;
  }

  for (var d of data) {

    if (!d.yelpBusinessId || d.yelpBusinessId === '-' || !d.yelpBusiness) {
      continue;
    }

    if (d.yelpBusinessIdMatchScore < MINIMUM_MATCH_SCORE) {
      continue;
    }

    let bData = {};
//    const categoryFilter = d.yelpBusiness.categories.map(c=>c[1]).join(','); // All-match
    const categoryFilter = d.yelpBusiness.categories[0][1]; // Most specific category
    try {
      const searchRequest = {
        sort: 2,
        radius_filter: COMPETITORS_RADIUS_KILOMETERS,
        location: d.address,
        category_filter: categoryFilter
      };
      bData = yield yelp.search(searchRequest);
    }
    catch(e) {
      console.log(`Error processing yelp request for ${d.yelpBusinessId}: ${e.data}`);
      continue;
    }
    if (!_.isEmpty(bData)) {
      yield updateDynamoData(d, bData);
    }

  };

  return res.key;
}
export function* competitors() {
  console.log(`Gather Yelp competitors`);
  let resumeKey = null;
  do {
    console.log(`Processing with limit ${limit}`);
    resumeKey = yield processNextCheck(limit, resumeKey);
    if (!resumeKey) {
      if (g_negativeReviews.length > 0) {
        console.log(`Writing File ${NEGATIVE_REVIEWS_FILE}`);
        jsonfile.writeFileSync(NEGATIVE_REVIEWS_FILE, g_negativeReviews, {spaces: 2});
      }
      return 'Done';
    }
  } while(true)
}
