const coffeeSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/search";
const coffeeSQUARE_PHOTO_URL = "https://api.foursquare.com/v2/venues/";

// End points for foursquare


const authParam = {
  client_id: '3WG5JN5H5WJ3NBWFW4QPDQHFYBA3QODYSMDX5PMEXC1ZCTLL',
  client_secret: 'HASDCGTNQIAN4UVJO0F4DNG5G1VBCMRZZI3NAEV1DDPFRQTL',
  v: "20171031"
};

// Requirements for geolocation api


function renderResult(result) {
  // function to render results
  return `
    <div class="myResults">
      <h2>${result.name}</h2>
      <p><img src="" class="myImg" id="${result.id}"></p>
      <p>${result.location.formattedAddress}</p>
      <p>${((result.location.distance)*0.000621371).toFixed(2)} miles <br> (from current location)</p>
      
    </div>
    <br>
  `;
  
}



$( ".cityButton" ).click(function() {
  let cityLocation = $("#cityInput").val();
  getDataFromApi2("coffee", displaySearchData, cityLocation);
  });


// 
// api radius measured in meters

function getDataFromApi(searchTerm, lat, lng, displaySearchData) {
  console.log("getDataFromApi is being called");
  
  const origQuery = {
    q: searchTerm,
    client_id: '3WG5JN5H5WJ3NBWFW4QPDQHFYBA3QODYSMDX5PMEXC1ZCTLL',
    client_secret: 'HASDCGTNQIAN4UVJO0F4DNG5G1VBCMRZZI3NAEV1DDPFRQTL',
    query: 'coffee',
    v: "20171031",
    radius: "8046.72",
    ll: `${lat},${lng}`
    
    
  }
  console.log("getJSON is being called");
  //callback is function that only gets executed when a certain condition is met.

  //create a second function getdatafromapi
  $.getJSON(coffeeSQUARE_SEARCH_URL, origQuery, displaySearchData);
}

function getDataFromApi2(searchTerm, callback, location) {
  console.log("getDataFromApi2 is being called");
  
  const origQuery = {
    q: searchTerm,
    client_id: '3WG5JN5H5WJ3NBWFW4QPDQHFYBA3QODYSMDX5PMEXC1ZCTLL',
    client_secret: 'HASDCGTNQIAN4UVJO0F4DNG5G1VBCMRZZI3NAEV1DDPFRQTL',
    query: 'coffee',
    v: "20171031",
    radius: "8046.72",
    near: location
  }

  console.log("getJSON is being called");
  //callback is function that only gets executed when a certain condition is met.

  //create a second function getdatafromapi
  $.getJSON(coffeeSQUARE_SEARCH_URL, origQuery, callback);
}


function displaySearchData(data) {
  console.log(data);
  const results = data.response.venues.map((item, index) => {
    const requestURL = coffeeSQUARE_PHOTO_URL + item.id + "/photos";
    $.getJSON(requestURL, authParam, function(photoData){
      const photo = photoData.response.photos.items[0];
      if (photo) {
        const imageUrl = photo.prefix + "width100" + photo.suffix;
        $("#" + item.id).attr("src", imageUrl);
        console.log(photo.prefix + "width100" + photo.suffix);
      }
    });
    return renderResult(item);
  });
  console.log(results);
  $('.js-search-results').html(results);

}

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});

function watchSubmit() {
  $('#myButton').click(event => {
    event.preventDefault();
    console.log("function working");
    const queryTarget = $(event.currentTarget).find('.js-query');
    const origQuery = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getLocation();


  });
}

function getLocation() {

  var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };
    

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, options);
  } 
    
  function success(pos) {
    const lng = pos.coords.longitude;
    const lat = pos.coords.latitude;
    
    console.log("Latitude is", lat);
    console.log("Longitude is", lng);
    getDataFromApi("coffee", lat, lng, displaySearchData);
  }

  function error(message) {
    console.log("Geolocator failed:", message);
  }

}


$(watchSubmit);
