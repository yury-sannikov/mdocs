var dataFileName = './data/site.json';

$(document).ready(function() {
  console.log( "Document ready." );
});

$.getJSON(dataFileName, function(data) {
  // Template replacements
  $('#site_title').html(data.site.title);
  
  // $('title').html(data.site.title);
});


