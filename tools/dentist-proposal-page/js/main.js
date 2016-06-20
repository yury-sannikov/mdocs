$(document).ready(function() {
  $.getJSON( "data/ron-barr.json", function(data) {
    $('#doctorName').text(data.name);
    $('#doctorAddress').text(data.address);
  });
});
