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
new Chartist.Line('.ct-chart', data);




new Chartist.Line('.ct-chart-comp', {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  series: [
    {name: 'Income', data: [20000, 30000, 35000, 32000, 40000, 42000, 50000, 62000, 80000, 94000, 100000, 120000]},
    {name: 'Expenses', data: [10000, 15000, 12000, 14000, 20000, 23000, 22000, 24000, 21000, 18000, 30000, 32000]}
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
      caption: 'Fiscal year 2015',
      seriesHeader: 'business numbers',
      summary: 'A graphic that shows the business numbers of the fiscal year 2015',
      valueTransform: function(value) {
        return value + ' dollar';
      },
      // ONLY USE THIS IF YOU WANT TO MAKE YOUR ACCESSIBILITY TABLE ALSO VISIBLE!
      visuallyHiddenStyles: 'position: absolute; top: 100%; width: 100%; font-size: 11px; overflow-x: auto; background-color: rgba(0, 0, 0, 0.1); padding: 10px'
    })
  ]
});



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


var dataFileName = "./data/7eedf541-8974-42fe-a38e-f688e8ccfcdc-elizabeth-zapp.json";

$.getJSON(dataFileName, function(data) {
  console.log(data.reviews);
  var items = [];
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
