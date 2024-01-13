$('document').ready(function () {
  const checkedStates = {};
  const checkedCities = {};
  const checkedAmenities = {};
  $('input[type=checkbox]').click(function () {
    $('.amenity_check:checked').each(function () {
      checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    });
    $('.amenity_check:not(:checked)').each(function () {
      delete checkedAmenities[$(this).attr('data-id')];
    });
    $('.state_check:checked').each(function () {
      checkedStates[$(this).attr('data-id')] = $(this).attr('data-name');
    });
    $('.state_check:not(:checked)').each(function () {
      delete checkedStates[$(this).attr('data-id')];
    });
    $('.city_check:checked').each(function () {
      checkedCities[$(this).attr('data-id')] = $(this).attr('data-name');
    });
    $('.city_check:not(:checked)').each(function () {
      delete checkedCities[$(this).attr('data-id')];
    });
    $('.locations h4').text(
      Object.values(checkedStates).join(', ') +
    (Object.values(checkedStates).length > 0 && Object.values(checkedCities).length > 0 ? ', ' : '') +
    Object.values(checkedCities).join(', ')
    );
    $('.amenities h4').text(Object.values(checkedAmenities).join(', '));
  });
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({}),
    success: function (data) {
      for (const place of data) {
        const articleHtml = `
      <article>
      <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">$${place.price_by_night}</div>
      </div>
      <div class="information">
        <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
          <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
      </div>
        <div class="description">
        ${place.description}
        </div>
      </article>`;
        $('section.places').append(articleHtml);
      }
    }
  }, 'json');
  $('button').click(function () {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        states: Object.keys(checkedStates),
        cities: Object.keys(checkedCities),
        amenities: Object.keys(checkedAmenities)
      }),
      success: function (data) {
        $('section.places').empty();
        for (const place of data) {
          const articleHtml = `
        <article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
        </div>
          <div class="description">
          ${place.description}
          </div>
        </article>`;
          $('section.places').append(articleHtml);
        }
      }
    }, 'json');
  });
});

$.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
  if (data.status === 'OK') {
    $('#api_status').addClass('available');
  } else {
    $('#api_status').removeClass('available');
  }
});
