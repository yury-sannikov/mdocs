var fileUrl = window.location.href;
var dataFileName = "data/" + _.head(_.last(fileUrl.split('/')).split('.')) + ".json";

$.getJSON(dataFileName, function( data ) {
  var items = [];

  // Date
  var dt = data.reportDate;
  $('#reportDate').append(dt);

  var name = data.providerName;
  $('#providerName').append(name);

  var address = data.providerAddress;
  $('#providerAddress').append(address);

  var makeAddressCheckmark = function(isAccurate) {
    if (isAccurate) {
      return "<td style='text-align: center; vertical-align: middle;'><i class='fa fa-check-circle green'></i><br>Correct address</td>"
    } else {
      return "<td style='text-align: center; vertical-align: middle;'><i class='fa fa-exclamation-circle red'></i><br>Incorrect address</td>"
    }
  }

  var makeLink = function(name, url) {
    return "<td style='text-align: center; vertical-align: middle;'><a href="+ url + "><strong>" + name + "</strong></a></td>";
  }

  var makeStars = function(rating, reviewCount) {
    var result = "";
    for (var i=0; i < Math.floor(rating); i++) {
      result += "<i class='fa fa-star golden'></i>";
    }

    for (var i=0; i < 5-Math.floor(rating); i++) {
      result += "<i class='fa fa-star grey'></i>";
    }

    return "<td style='text-align: center; vertical-align: middle;'>" + result + "<br>Based on " + reviewCount + " reviews</td>";
  }

  var makeAvgStars = function(data) {
    var avg = _.meanBy(data.reviews, 'rating') + data.bias;
    var reviewCount = _.sumBy(data.reviews, 'reviewCount');
    var result = "";

    for (var i=0; i < Math.floor(avg); i++) {
      result += "<i class='fa fa-star golden'></i>";
    }

    for (var i=0; i < 5-Math.floor(avg); i++) {
      result += "<i class='fa fa-star grey'></i>";
    }

    return result + "<br>Based on " + reviewCount + " reviews";
  }

  var avgStars = makeAvgStars(data);
  $('#avgStars').append(avgStars);

  var makeGrade = function(rating) {
    var letterGrade = '';
    switch(Math.floor(rating)) {
      case 5:
          letterGrade = 'A';
          break;
      case 4:
          letterGrade = 'B';
          break;
      case 3:
          letterGrade = 'C';
          break;
      case 2:
          letterGrade = 'D';
          break;
      case 1:
          letterGrade = 'F';
          break;
      case 0:
          letterGrade = 'X';
          break;
      default:
          letterGrade = 'A';
    }
    return "<td style='text-align: center; vertical-align: middle;'><h1 class='score'>" + letterGrade+ "</h1>Current Grade</td>";
  }

  var avgGrade = makeGrade(_.meanBy(data.reviews, 'rating') + data.bias);
  $('#avgGrade').append(avgGrade);

  $.each( _.sortBy(data.reviews, ['rating']).reverse(), function( key, val ) {
    var rowStr = "<tr>";
    rowStr += makeLink(val.siteName, val.siteUrl);
    rowStr += makeAddressCheckmark(val.addressAccurate);
    rowStr += makeStars(val.rating, val.reviewCount);
    rowStr += makeGrade(val.rating);
    rowStr += "</tr>";
    $('#dataTable').append(rowStr);
  });
 
  
});
