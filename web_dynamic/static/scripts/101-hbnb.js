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
    <div class="reviews"><h2>
      <span id="${place.id}n" class="treview">Reviews</span>
      <span id="${place.id}" onclick="showReviews(this)">Show</span></h2>
      <ul id="${place.id}r"></ul>
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
      <div class="reviews"><h2>
      <span id="${place.id}n" class="treview">Reviews</span>
      <span id="${place.id}" onclick="showReviews(this)">Show</span></h2>
      <ul id="${place.id}r"></ul>
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

function showReviews (obj) {
  if (obj === undefined) {
    return;
  }
  if (obj.textContent === 'Show') {
    obj.textContent = 'Hide';
    $.get(`http://0.0.0.0:5001/api/v1/places/${obj.id}/reviews`, (data, textStatus) => {
      if (textStatus === 'success') {
        $(`#${obj.id}n`).html(data.length + ' Reviews');
        for (const review of data) {
          printReview(review, obj);
        }
      }
    });
  } else {
    obj.textContent = 'Show';
    $(`#${obj.id}n`).html('Reviews');
    $(`#${obj.id}r`).empty();
  }
}

function printReview (review, obj) {
  const date = new Date(review.created_at);
  const month = date.toLocaleString('en', { month: 'long' });
  const day = dateOrdinal(date.getDate());

  if (review.user_id) {
    $.get(`http://0.0.0.0:5001/api/v1/users/${review.user_id}`, (data, textStatus) => {
      if (textStatus === 'success') {
        $(`#${obj.id}r`).append(
          `<li><h3>From ${data.first_name} ${data.last_name} the ${day + ' ' + month + ' ' + date.getFullYear()}</h3>
          <p>${review.text}</p>
          </li>`);
      }
    });
  }
}

function dateOrdinal (dom) {
  if (dom === 31 || dom === 21 || dom === 1) return dom + 'st';
  else if (dom === 22 || dom === 2) return dom + 'nd';
  else if (dom === 23 || dom === 3) return dom + 'rd';
  else return dom + 'th';
}