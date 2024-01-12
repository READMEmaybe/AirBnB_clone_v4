$('document').ready(function () {
	$('input[type=checkbox]').click(function () {
	  const checkedAmenities = {};
	  $('input[type=checkbox]:checked').each(function () {
		checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
	  });
	  $('.amenities h4').text(Object.values(checkedAmenities).join(', '));
	});
  });
  
$.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
  if (data.status === 'OK') {
	$('#api_status').addClass('available');
  } else {
	$('#api_status').removeClass('available');
  }
});
