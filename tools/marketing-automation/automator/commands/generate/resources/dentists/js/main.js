$(document).ready(function() {
  $.getJSON( "data/joyce-xia.json", function(data) {
    $('.doctorName').text(data.name);
    $('.doctorAddress').text(data.address);
    $('.doctorType').text(data.type);
  });

  $.getJSON( "data/main.json", function(data) {
    $('.createdBy').text(data.createdBy);
    var today = new Date();
    $('.createdDate').text(moment().format("MM/DD/YYYY"));
  });

});
