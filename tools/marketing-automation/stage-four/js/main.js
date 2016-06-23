var dataFileName = './data/7eedf541-8974-42fe-a38e-f688e8ccfcdc-elizabeth-zapp.json';

var ratingsSeries = [];
var revenueSeries = [];
var topRatingsSeries = [];

$.getJSON(dataFileName, function(data) {
  var averageRating = _.round(_.meanBy(data.reviews, function(d) { return d.rating; }),2);
  var delta = 5 - averageRating;
  var step = _.round(delta/12, 2);
  
  ratingsSeries.push(averageRating);

  for (i=1; i<12; i++) {
    var bias = _.random(0, step);
    var total = averageRating + i*step + bias;
    ratingsSeries.push(_.round(total, 2));
  }

  ratingsSeries.push(5);

  var revenueCoefficient = 1270.80;
  _(ratingsSeries).forEach(function(value) {
    revenueSeries.push(_.round(value * revenueCoefficient + _.random(0, revenueCoefficient/3, true)));
  });

  // Top ratings
  topRatingsSeries = _.orderBy(data.reviews, ['rating'], ['desc']);

  var i = 0;
  _.forEach(topRatingsSeries, function(item) {
    var donutDivName = 'ct-chart-donut' + i;
    $("#donutCharts").append($( "<div class='col-md-4'><div class='" + donutDivName + "'></div>" ));
    new Chartist.Pie('.' + donutDivName, 
      {
        series: [220*(item.rating)/5, 220-(220*(item.rating)/5)]
      }, {
          donut: true,
          donutWidth: 20,
          startAngle: 210,
          total: 260,
          showLabel: false,
          plugins: [
              Chartist.plugins.fillDonut({
                  items: [{
                      content: '<i class="fa fa-tachometer"></i>',
                      position: 'bottom',
                      offsetY : 12,
                      offsetX: 0
                  }, {
                      content: '<h3>' + item.rating + '</h3><span>' + item.siteId + '</span>'
                  }]
              })
          ],
      });

    i++;
  });


});

new Chartist.Line('.ct-chart-tresh', {
  labels: ['Today', '3mo', '6mo', '9mo', '12mo', '15mo', '18mo', '21mo', '24mo', '27mo', '30mo', '33mo', '36mo'],
  series: [
    ratingsSeries
  ]
}, {
  showArea: true,
  axisY: {
    onlyInteger: false
  },
  plugins: [
    Chartist.plugins.ctThreshold({
      threshold: 4
    }),
    Chartist.plugins.ctPointLabels({
      textAnchor: 'middle'
    }),
    Chartist.plugins.ctAxisTitle({
      axisX: {
        axisTitle: 'Time (months)',
        axisClass: 'ct-axis-title',
        offset: {
          x: 0,
          y: 32
        },
        textAnchor: 'middle'
      },
      axisY: {
        axisTitle: 'Ratings',
        axisClass: 'ct-axis-title',
        offset: {
          x: 0,
          y: -4
        },
        textAnchor: 'middle',
        flipTitle: false
      }
    })
  ]
});


new Chartist.Bar('.ct-chart-revenue', {
    labels: ['Today', '3mo', '6mo', '9mo', '12mo', '15mo', '18mo', '21mo', '24mo', '27mo', '30mo', '33mo', '36mo'],
    series: [
      {
        "name": "Revenue",
        "data": revenueSeries
      }
    ]
}, {
    plugins: [
      Chartist.plugins.ctPointLabels({
        textAnchor: 'middle'
      }),
      Chartist.plugins.ctAxisTitle({
        axisX: {
          axisTitle: 'Time (months)',
          axisClass: 'ct-axis-title',
          offset: {
            x: 0,
            y: 32
          },
          textAnchor: 'middle'
        },
        axisY: {
          axisTitle: 'Revenue ($)',
          axisClass: 'ct-axis-title',
          offset: {
            x: 0,
            y: 0
          },
          textAnchor: 'middle',
          flipTitle: false
        }
      }),
      Chartist.plugins.ctAccessibility({
        caption: 'Ratings vs. Revenue Projection',
        seriesHeader: '',
        summary: 'A graphic that shows the business numbers of the fiscal year 2015',
        valueTransform: function(value) {
          return '$' + value;
        },
        // ONLY USE THIS IF YOU WANT TO MAKE YOUR ACCESSIBILITY TABLE ALSO VISIBLE!
        visuallyHiddenStyles: 'position: absolute; top: 100%; width: 100%; font-size: 11px; overflow-x: auto; background-color: rgba(0, 0, 0, 0.1); padding: 10px'
      })
    ]
});
