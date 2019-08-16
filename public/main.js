// Hardcoded Newton Coordinates
mapboxgl.accessToken = 'pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-71.184769, 42.291881], // starting position [lng, lat]
  pitch: 30, // pitch in degrees
  bearing: -20, // bearing in degrees
  zoom: 11 // starting zoom
});

// *********************************************************************************
//3D Buildings https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/
// *********************************************************************************
map.on('load', function() {
  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;
  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
    }
  }
  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',
      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
        'interpolate', ['linear'],
        ['zoom'],
        15, 0,
        15.05, ['get', 'height']
      ],
      'fill-extrusion-base': [
        'interpolate', ['linear'],
        ['zoom'],
        15, 0,
        15.05, ['get', 'min_height']
      ],
      'fill-extrusion-opacity': .6
    }
  }, labelLayerId);
});
// *********************************************************************************
//End: 3D Buildings https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/
// *********************************************************************************

let streetAddress = ''
let city = ''
let state = ''
let rawAddress = ''
let latitude = 0
let longitude = 0
let ZestimateAmt = 0

// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
function geoFindMe() {
console.log("findLatLongAddress clicked");
  const findMeStatus = document.querySelector('#findMeStatus');
  //LINK TO EXTERNAL MAP 2 OF 3
  // const mapLink = document.querySelector('#map-link');
  // mapLink.href = '';
  // mapLink.textContent = '';

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    findMeStatus.textContent = '';
    //LINK TO EXTERNAL MAP 3 OF 3
    // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

    // *********************************************************************************
    // TEMPORARY HARD-CODED LAT & LON COORDINATES
    // Newton Coordinates
    // latitude = 42.291881
    // longitude = -71.184769

    // Boston Coordinates
    // latitude = 42.3601
    // longitude = -71.0589

    // Providence Coordinates
    // latitude = 41.8240
    // longitude = -71.4128

    // *********************************************************************************

    map.flyTo({
      center: [longitude, latitude],
      speed: .2
    });





    // Reverse Geocoding (Mapbox)
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ`)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        console.log(response.features[0].place_name)
        rawAddress = response.features[0].place_name
        console.log('length', rawAddress.split(', ').length)
        document.querySelector('#rawAddress').textContent = rawAddress

        //gets Address values to next put into Zillow API
        parseAddressByLength(rawAddress)

      })
      .catch(error => {
        console.log(`error ${error}`)
        alert('Sorry, unable to obtain Address from Mapbox')
      })
  }

  function error() {
    findMeStatus.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    findMeStatus.textContent = 'Geolocation is not supported by your browser';
  } else {
    findMeStatus.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }

}

// fetch('https://cors-anywhere.herokuapp.com/http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz17qrfs9kp3f_17jma&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA')
// fetch('https://cors-anywhere.herokuapp.com/http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz17qrfs9kp3f_17jma&address=34 Goldcliff Rd&citystatezip=Malden%2C+MA')
function getZestimate() {
  console.log('#getZestimate');

  // Zoom In - LIVE
  map.zoomTo(18, {
    duration: 16000
  })
  // fetch(`https://cors-anywhere.herokuapp.com/http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz17qrfs9kp3f_17jma&address=138 Cherry Street&citystatezip=Malden%2C+Massachusetts`)
  fetch(`https://cors-anywhere.herokuapp.com/http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz17qrfs9kp3f_17jma&address=${streetAddress}&citystatezip=${city}%2C+${state}`)
    .then(response => response.text())
    .then(response => {
      // DOMParser constructor
      let parser = new DOMParser()
      let xml = parser.parseFromString(response, 'application/xml')
      console.log('ZestimateAmt and Address', xml)
      ZestimateAmt = xml.querySelector('amount').innerHTML
      // Convert to Number
      ZestimateAmt = Number.parseInt(ZestimateAmt)
      // Round to 10,000
      ZestimateAmt = Math.round(ZestimateAmt / 10000) * 10000
      // ADD COMMAS AT EVERY THOUSAND
      ZestimateAmt = ZestimateAmt.toLocaleString()
      console.log(`ZestimateAmt $${ZestimateAmt}`)
      ZestimateAmt = `$${ZestimateAmt} Zestimate®`
      document.querySelector('#zestimate').textContent = ZestimateAmt
    })
    .catch(error => {
      console.log(`Zillow API error ${error}`)
      document.querySelector("#zestimate").innerText = 'Sorry, Unable To Retrieve Estimate at this time'
    })
}

function parseAddressByLength(rawAddress) {
  if (rawAddress.split(', ').length === 4) {
    streetAddress = rawAddress.split(', ')[0]
    console.log('streetAddress', streetAddress)
    city = rawAddress.split(', ')[1]
    console.log('city', city)
    state = rawAddress.split(', ')[2].split(' ')[0]
    console.log('state', state)
  } else {
    streetAddress = rawAddress.split(', ')[1]
    console.log('streetAddress', streetAddress)
    city = rawAddress.split(', ')[2]
    console.log('city', city)
    state = rawAddress.split(', ')[3].split(' ')[0]
    console.log('state', state)
  }
}

// console.log(document.querySelector("#currentUser").innerHTML, "currentUser")
function saveHouse() {
  console.log('#saveHouse');

  fetch('saveHouse', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // 'user' : document.querySelector("#currentUser").innerHTML,
        'rawAddress': rawAddress,
        'latitude': latitude,
        'longitude': longitude,
        'ZestimateAmt': ZestimateAmt
      })
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
}

document.querySelector('#findLatLongAddress').addEventListener('click', geoFindMe)

document.querySelector('#getZestimate').addEventListener('click', getZestimate)

document.querySelector('#saveHouse').addEventListener('click', saveHouse)


let trash = document.querySelectorAll(".fa-trash")
trash.forEach((element) => {
  element.addEventListener('click', function() {
    const rawAddress = this.parentNode.parentNode.childNodes[7].innerText
    console.log("rawAddress",rawAddress)
    fetch('removeHouse', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        //changing to JSON format to send from client to server
        body: JSON.stringify({
          'rawAddress': rawAddress
        })
      })
      .then(function(response) {
        window.location.reload()
      })
  });
});

let star = document.querySelectorAll(".fa-star")
star.forEach((element) => {
  element.addEventListener('click', function() {
    const rawAddress = this.parentNode.parentNode.childNodes[7].innerText
    console.log(rawAddress)
    fetch('starHouse', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        //changing to JSON format to send from client to server
        body: JSON.stringify({
          'rawAddress': rawAddress
        })
      })
      .then(function(response) {
        window.location.reload()
      })
  });
});








//
