$('document').ready(function () {
  $('input[type=checkbox]').click(function () {
	const checkedAmenities = {};
	$('input[type=checkbox]:checked').each(function () {
	  checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
	});
	$('.amenities h4').text(Object.values(checkedAmenities).join(', '));
  });
});
