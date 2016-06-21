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

const limit = 10;
const RATE_NEGATIVE_IF_LESS_THAN = 3;
const NEGATIVE_REVIEWS_FILE = './negative_reviews.json';

let g_negativeReviews = [];
function negativeReviewAppears(data, businessData, firstTime) {
  console.log(`Found negative review for ${data.yelpBusinessId} with rate ${businessData.reviews[0].rating}, First Time:${firstTime}`);
  g_negativeReviews.push({
    data,
    businessData,
    firstTime
  });
}

function* updateDynamoRate(data, businessData, yelpBusinessReviewHash, firstTime) {
  const lastReview = businessData.reviews[0];
  let newData = Object.assign({}, data, {
    yelpBusinessReviewHash,
    yelpBusinessReviewRate: lastReview.rating,
    yelpBusinessReviewRateDate: lastReview.time_created,
    yelpBusiness: businessData
  });
  delete newData.fullname;
  yield saveRecord$(data.fullname, newData);

  if (lastReview.rating < RATE_NEGATIVE_IF_LESS_THAN) {
    negativeReviewAppears(data, businessData, firstTime);
  }

}

function* processNextCheck(limit, rkey) {
  const res = yield queryAvailable$(limit, rkey);
  const data = res.data;

  console.log(`Processing ${data.length} items`);

  if (!res.key) {
    return null;
  }

  for (var d of data) {
    let bData = {};
    try {
      bData = yield yelp.business(d.yelpBusinessId);
    }
    catch(e) {
      console.log(`Error processing yelp request for ${d.yelpBusinessId}: ${e.data}`);
      continue;
    }
    if (!_.isArray(bData.reviews)) {
      continue;
    }
    const lastReview = bData.reviews[0];

    const yelpBusinessReviewHash = md5(lastReview.excerpt);

    if (!d.yelpBusinessReviewRate) {
      yield updateDynamoRate(d, bData, yelpBusinessReviewHash, true);
    } else {

      if (d.yelpBusinessReviewHash !== yelpBusinessReviewHash) {
        yield updateDynamoRate(d, bData, yelpBusinessReviewHash, false);
      }
    }
  };

  return res.key;
}
export function* check() {
  console.log(`Check Yelp reviews`);
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
