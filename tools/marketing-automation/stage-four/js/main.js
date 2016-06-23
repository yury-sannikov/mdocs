var dataFileName = './data/7eedf541-8974-42fe-a38e-f688e8ccfcdc-elizabeth-zapp.json';

var ratingsSeries = [];
var revenueSeries = [];

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
  // revenueSeries = _.filter(ratingsSeries, function(o) { return o*revenueCoefficient; });
  _(ratingsSeries).forEach(function(value) {
    revenueSeries.push(_.round(value * revenueCoefficient + _.random(0, revenueCoefficient/3, true)));
  });

  // revenueSeries[0] = 0;
  console.log(revenueSeries);
});

//[2.7, 2.8, 3.1, 3.2, 3.3, 3.6, 3.8, 4.4, 4.3, 4.5, 4.3, 4.9, 5.0]

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
        "name": "Revenue Growth",
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
          return value + ' dollar';
        },
        // ONLY USE THIS IF YOU WANT TO MAKE YOUR ACCESSIBILITY TABLE ALSO VISIBLE!
        visuallyHiddenStyles: 'position: absolute; top: 100%; width: 100%; font-size: 11px; overflow-x: auto; background-color: rgba(0, 0, 0, 0.1); padding: 10px'
      })
    ]
});




new Chartist.Line('.ct-chart-comp', {
  labels: ['Today', '3mo', '6mo', '9mo', '12mo', '15mo', '18mo', '21mo', '24mo', '27mo', '30mo', '33mo', '36mo'],
  series: [
    {name: 'Revenue', data: [20000, 30000, 35000, 32000, 40000, 42000, 50000, 62000, 80000, 94000, 100000, 120000]},
    {name: 'Ratings', data: [2700, 2800, 3.1, 3.2, 3.3, 3.6, 3.8, 4.4, 4.3, 4.5, 4.3, 4.9, 5.0]},
    {name: 'Rati', data: [2700, 20000, 3.1, 3.2, 3.3, 3.6, 3.8, 4.4, 4.3, 4.5, 4.3, 4.9, 5.0]}
  ]
}, {
  fullWidth: true,
  lineSmooth: false,
  chartPadding: {
    right: 20,
    left: 10
  },
  axisX: {
    labelInterpolationFnc: function(value) {
      return value.split('').slice(0, 3).join('');
    }
  },
  plugins: [
    Chartist.plugins.ctAccessibility({
      caption: 'Ratings vs. Revenue Projection',
      seriesHeader: '',
      summary: 'A graphic that shows the business numbers of the fiscal year 2015',
      valueTransform: function(value) {
        return value + ' dollar';
      },
      // ONLY USE THIS IF YOU WANT TO MAKE YOUR ACCESSIBILITY TABLE ALSO VISIBLE!
      visuallyHiddenStyles: 'position: absolute; top: 100%; width: 100%; font-size: 11px; overflow-x: auto; background-color: rgba(0, 0, 0, 0.1); padding: 10px'
    })
  ]
});





var data = {
  // A labels array that can contain any sort of values
  labels: [1, 2, 3, 4, 5],
  // Our series array that contains series objects or in this case series data arrays
  series: [
    [0, 5, 8, 5, 0]
  ]
};

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
new Chartist.Line('.ct-chart-line', data);





var donutChart = new Chartist.Pie('.ct-chart-donut', 
    {
        series: [160, 60],
        labels: ['', '']
    }, {
        donut: true,
        donutWidth: 40,
        startAngle: 210,
        total: 260,
        showLabel: false,
        plugins: [
            Chartist.plugins.fillDonut({
                items: [{
                    content: '<i class="fa fa-tachometer"></i>',
                    position: 'bottom',
                    offsetY : 10,
                    offsetX: -2
                }, {
                    content: '<h3>155<span class="small"> reviews</span></h3>'
                }]
            })
        ],
    });

donutChart.on('draw', function(data) {
    if(data.type === 'slice' && data.index == 0) {
        // Get the total path length in order to use for dash array animation
        var pathLength = data.element._node.getTotalLength();

        // Set a dasharray that matches the path length as prerequisite to animate dashoffset
        data.element.attr({
            'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
        });

        // Create animation definition while also assigning an ID to the animation for later sync usage
        var animationDefinition = {
            'stroke-dashoffset': {
                id: 'anim' + data.index,
                dur: 1200,
                from: -pathLength + 'px',
                to:  '0px',
                easing: Chartist.Svg.Easing.easeOutQuint,
                fill: 'freeze'
            }
        };

        // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
        data.element.attr({
            'stroke-dashoffset': -pathLength + 'px'
        });

        // We can't use guided mode as the animations need to rely on setting begin manually
        // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
        data.element.animate(animationDefinition, true);
    }
});



new Chartist.Line('.ct-chart-line', {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    series: [
        [12, 9, 7, 8, 5],
        [2, 1, 3.5, 7, 3],
        [1, 3, 4, 5, 6]
    ]
}, {
    fullWidth: true,
    chartPadding: {
        right: 40
    },
    plugins: [
        Chartist.plugins.legend({
            legendNames: ['Blue pill', 'Red pill', 'Purple pill'],
        })
    ]
});

new Chartist.Pie('.ct-chart-pie', {
    labels: ['Piece A', 'Piece B', 'Piece C', 'Piece D'],
    series: [20, 10, 30, 40]
}, {
    showLabel: false,
    plugins: [
        Chartist.plugins.legend()
    ]
});

new Chartist.Bar('.ct-chart-bar', {
    labels: ['First quarter of the year', 'Second quarter of the year', 'Third quarter of the year', 'Fourth quarter of the year'],
    series: [
        {"name": "Money A", "data": [60000, 40000, 80000, 70000]},
        {"name": "Money B", "data": [40000, 30000, 70000, 65000]},
        {"name": "Money C", "data": [8000, 3000, 10000, 6000]}
    ]
}, {
    plugins: [
        Chartist.plugins.legend()
    ]
});







// var fileUrl = window.location.href;
// var dataFileName = "data/" + _.head(_.last(fileUrl.split('/')).split('.')) + ".json";

// $.getJSON(dataFileName, function( data ) {
//   var items = [];

//   // Date
//   var dt = data.reportDate;
//   $('#reportDate').append(dt);

//   var name = data.providerName;
//   $('#providerName').append(name);

//   var address = data.providerAddress;
//   $('#providerAddress').append(address);

//   var makeAddressCheckmark = function(isAccurate) {
//     if (isAccurate) {
//       return "<td style='text-align: center; vertical-align: middle;'><i class='fa fa-check-circle green'></i><br>Correct address</td>"
//     } else {
//       return "<td style='text-align: center; vertical-align: middle;'><i class='fa fa-exclamation-circle red'></i><br>Incorrect address</td>"
//     }
//   }

//   var makeLink = function(name, url) {
//     return "<td style='text-align: center; vertical-align: middle;'><a href="+ url + "><strong>" + name + "</strong></a></td>";
//   }

//   var makeStars = function(rating, reviewCount) {
//     var result = "";
//     for (var i=0; i < Math.floor(rating); i++) {
//       result += "<i class='fa fa-star golden'></i>";
//     }

//     for (var i=0; i < 5-Math.floor(rating); i++) {
//       result += "<i class='fa fa-star grey'></i>";
//     }

//     return "<td style='text-align: center; vertical-align: middle;'>" + result + "<br>Based on " + reviewCount + " reviews</td>";
//   }

//   var makeAvgStars = function(data) {
//     var avg = _.meanBy(data.reviews, 'rating') + data.bias;
//     var reviewCount = _.sumBy(data.reviews, 'reviewCount');
//     var result = "";

//     for (var i=0; i < Math.floor(avg); i++) {
//       result += "<i class='fa fa-star golden'></i>";
//     }

//     for (var i=0; i < 5-Math.floor(avg); i++) {
//       result += "<i class='fa fa-star grey'></i>";
//     }

//     return result + "<br>Based on " + reviewCount + " reviews";
//   }

//   var avgStars = makeAvgStars(data);
//   $('#avgStars').append(avgStars);

//   var makeGrade = function(rating) {
//     var letterGrade = '';
//     switch(Math.floor(rating)) {
//       case 5:
//           letterGrade = 'A';
//           break;
//       case 4:
//           letterGrade = 'B';
//           break;
//       case 3:
//           letterGrade = 'C';
//           break;
//       case 2:
//           letterGrade = 'D';
//           break;
//       case 1:
//           letterGrade = 'F';
//           break;
//       case 0:
//           letterGrade = 'X';
//           break;
//       default:
//           letterGrade = 'A';
//     }
//     return "<td style='text-align: center; vertical-align: middle;'><h1 class='score'>" + letterGrade+ "</h1>Current Grade</td>";
//   }

//   var avgGrade = makeGrade(_.meanBy(data.reviews, 'rating') + data.bias);
//   $('#avgGrade').append(avgGrade);

//   $.each( _.sortBy(data.reviews, ['rating']).reverse(), function( key, val ) {
//     var rowStr = "<tr>";
//     rowStr += makeLink(val.siteName, val.siteUrl);
//     rowStr += makeAddressCheckmark(val.addressAccurate);
//     rowStr += makeStars(val.rating, val.reviewCount);
//     rowStr += makeGrade(val.rating);
//     rowStr += "</tr>";
//     $('#dataTable').append(rowStr);
//   });
 
  
// });
