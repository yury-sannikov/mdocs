import _ from 'lodash';
import Yelp from 'yelp';
import JSONStream from 'JSONStream';
import cs from 'co-stream';

const YELP_CONSUMER_KEY='2UolyG7wPxAoqO3-xijMUA';
const YELP_CONSUMER_SECRET='Ab8qF4udakDK4igMuzuBvhm5rDs';
const YELP_TOKEN='J7bG2O8BwIfz5gjRL3wyhh_64gSFc3VD';
const YELP_TOKEN_SECRET='ZEk0QHjKuVcqdiSxeNIqLTlZlPw';

const COMPETITORS_RADIUS_METERS = 10 * 1600;

const yelp = new Yelp({
  consumer_key: YELP_CONSUMER_KEY,
  consumer_secret: YELP_CONSUMER_SECRET,
  token: YELP_TOKEN,
  token_secret: YELP_TOKEN_SECRET
});

export function help() {
  return {
    name: 'competitors',
    description: 'This command finds Yelp organization by full name and address and return a JSON of top competitors in this area.',
    options: [{
      key: '--yelp-categories',
      required: true,
      short: 'cat',
      description: 'Yelp default categories. Use for search for business in case of no categories is available from Yelp site.'
    },
    {
      key: '--selector',
      required: false,
      short: 'sel',
      description: 'JSON selector, for instance providers.* process each element in providers array'
    }]

  };
}


export function* execute(inputStream, params) {
  const yelpcategories = params['yelp-categories'];
  if (_.isEmpty(yelpcategories)) {
    throw TypeError('You have to specify yelp-categories parameter');
  }
  const { selector } = params;
  return inputStream
    .pipe(JSONStream.parse(selector || '*'))
    .pipe(cs.map(function* (data) {
      return yield process(data, yelpcategories);
    },{ objectMode: true, parallel: 1 }));
}

function* process(data, yelpDefaultCategories) {
  const yelpcategories = data.yelpcategory || yelpDefaultCategories;
  const { sites } = data;
  if (!_.isArray(sites)) {
    return data;
  }
  const yelpSite = sites.find( s => s.site.toLowerCase() === 'yelp');

  if (!yelpSite || !_.isString(yelpSite.url)) {
    return yield processNoYelp(data, yelpcategories);
  }

  const businessId = yelpSite.url.replace(/.+\/biz\//,'');

  let bData = {};
  try {
    bData = yield yelp.business(businessId);
  }
  catch(e) {
    console.error(`${businessId} - ${e.message || e.data}`);
    return yield processNoYelp(data, yelpcategories);
  }
  let thisCategory = yelpcategories;
  const { categories = [] } = bData || {};

  if (_.isArray(categories) && categories.length > 0) {
    const mainCategory = categories[0];
    if (_.isArray(mainCategory) && mainCategory.length > 1) {
      thisCategory = mainCategory[1];
    }
  }
  const address = `${data.address}, ${data.city}, ${data.state}, ${data.zip}`;

  let competitors = {}
  try {
    const searchRequest = {
      sort: 2,
      radius_filter: COMPETITORS_RADIUS_METERS,
      location: address,
      category_filter: thisCategory
    };
    competitors = yield yelp.search(searchRequest);
  }
  catch(e) {
    console.error(e.stack);
    return updateCompetitors(data, {}, bData);
  }

  return updateCompetitors(data, competitors, bData);
}



function* processNoYelp(data, yelpcategories) {
  const address = `${data.address}, ${data.city}, ${data.state} ${data.zip}`;
  let bData = {}
  try {
    const searchRequest = {
      sort: 2,
      radius_filter: COMPETITORS_RADIUS_METERS,
      location: address,
      category_filter: yelpcategories
    };
    bData = yield yelp.search(searchRequest);
  }
  catch(e) {
    console.error(e.stack);
    return data;
  }
  return updateCompetitors(data, bData, null);
}


function updateCompetitors(data, bData, yelpBusiness) {
  let { businesses = [] } = bData || {};
  businesses = businesses
    .filter( b => !b.is_closed)
    .filter( b => b.distance < COMPETITORS_RADIUS_METERS) // Filter out featured but far away
    .sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return b.review_count - a.review_count;
    });
  if (businesses.length === 0) {
    console.error(`Warn: No competitors found for ${data.name}`);
  }

  const competitors = {
    yelpBusiness,
    yelpCompetitors: businesses
  };

  return Object.assign({}, data, { competitors });
}
