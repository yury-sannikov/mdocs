'use strict';
const Router = require('koa-router');
import { sendEmailTrackingToSlack } from '../../comm';
import { getUser } from '../../db/sccds';

const router = new Router({
  prefix: '/reports'
});

router.get('/', function* () {

  const doctor = yield getUser(this.request.query.q || '-');

  if (!doctor) {
    throw Error('Invalid request');
  }

  let competitors = {};

  if (doctor.yelpCompetitors) {
    competitors = doctor.yelpCompetitors;
    let businesses = competitors.businesses;
    const totalCompetitors = businesses.length;
    let doctorWasInList = true;

    // Add doctor if he is not in a list
    if (businesses.findIndex( e=> e.id === doctor.yelpBusinessId) === -1) {
      businesses.push(doctor.yelpBusiness);
      doctorWasInList = false;
    }

    businesses = businesses.sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return b.review_count - a.review_count;
    });
    const doctorRateIndex = businesses.findIndex( e=> e.id === doctor.yelpBusinessId);
    const topCompetitors = businesses.slice(0, doctorRateIndex);

    const doctorLocation = doctor.yelpBusiness.location.coordinate;
    let avgLocation = topCompetitors.reduce( (p, c) => {
      return {
        latitude: p.latitude + c.location.coordinate.latitude,
        longitude: p.longitude + c.location.coordinate.longitude
      };
    }, {latitude: doctorLocation.latitude, longitude: doctorLocation.longitude});
    avgLocation.latitude = avgLocation.latitude / (topCompetitors.length + 1);
    avgLocation.longitude = avgLocation.longitude / (topCompetitors.length + 1);

    let mapURL = `http://dev.virtualearth.net/REST/V1/Imagery/Map/Road/${avgLocation.latitude}%2C${avgLocation.longitude}/13?mapSize=650,650&format=png&key=Aofkdg_ubpQFMHIGqPj8R0-vvPkkxNPHViTfZxcq7VFOqyhngPvZDVGWXfU9micN`;
    mapURL = `${mapURL}&pushpin=${doctorLocation.latitude},${doctorLocation.longitude};20;You Are Here`;

    topCompetitors.forEach((c) => {
      const loc = c.location.coordinate;
      mapURL = `${mapURL}&pushpin=${loc.latitude},${loc.longitude};28;★${c.rating.toFixed(1)}`;
    });

    competitors = {
      doctorRateIndex,
      doctorWasInList,
      totalCompetitors,
      topCompetitors,
      mapURL,
      businesses
    };
  }

  this.render('reportCard/landing', Object.assign({}, this.jadeLocals, {
    doctor,
    competitors
  }), true);
});

module.exports = router;
