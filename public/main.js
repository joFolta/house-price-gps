// Javascript Loaded
console.log("main.js loaded");

// Default Coordinates for Map
mapboxgl.accessToken = 'pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-71.184769, 42.291881], // starting position [lng, lat]
  pitch: 30, // pitch in degrees
  bearing: -20, // bearing in degrees
  zoom: 11 // starting zoom
});

// 3D Buildings
mapOn()

// Variables
let streetAddress = ''
let city = ''
let state = ''
let zip = ''
let rawAddress = ''
let latitude = 0
let longitude = 0
let ZestimateAmt = 0
let yearBuilt, purpose, liveSqFt, lotSqFt, bedRoom, bathRoom, totalRoom, soldDate, soldPrice, comps, neighValue, moreInfo

// HTML5 Geolocation
function geoFindMe() {
  console.log('Find Nearest House - CLICKED!');
  const findMeStatus = document.querySelector('#findMeStatus');

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    setTimeout(function(){ findMeStatus.textContent = '' }, 800);
    // findMeStatus.textContent = '';
    // *********************************************************************************
    // TEMPORARY HARD-CODED LAT & LON COORDINATES
    // Newton Coordinates
    // latitude = 42.291881
    // longitude = -71.184769

    // Mattapan
    // latitude = 42.278241
    // longitude = -71.070810

    // West Roxbury
    // latitude = 42.261375
    // longitude = -71.151051

    // Melrose
    // latitude = 42.444334
    // longitude = -71.031010

    // Roslindale
    // latitude = 42.278579
    // longitude = -71.129557

    // Noon Meridian Sandwich Shop - Boston
    // latitude = 42.357811
    // longitude = -71.058137

    // Providence Coordinates
    // latitude = 41.8240
    // longitude = -71.4128

    // ********************************************************************************

    // Map Fly
    mapFly()

    // Reverse Geocoding (Mapbox API)
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ`)
      .then(response => response.json())
      .then(response => {
        document.querySelector("#where").style.fontSize = "22px"
        console.log(response.features[0].place_name)
        rawAddress = response.features[0].place_name
        console.log('length', rawAddress.split(', ').length)
        document.querySelector('#rawAddress').textContent = rawAddress

        //Parses Address Variables input into Zillow API
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
  document.querySelector("#where").style.color = "#f82249"
}

// Housing Data (Zillow API)
function getZestimate() {
  console.log('Get House Price - CLICKED!');

  // Map Zoom
  mapZoom()

  // Input Parsed Address Variables into Zillow API
  fetch(`https://cors-anywhere.herokuapp.com/http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz17qrfs9kp3f_17jma&address=${streetAddress}&citystatezip=${city}%2C+${state}`)
    .then(response => response.text())
    .then(response => {
      document.querySelector("#price").style.fontSize = "22px"
      document.querySelector("#searchResults").innerHTML = "Explore the Details Link in the Favorite's List Below"
      document.querySelector("#searchResults").classList.add("pulsateExploreLink")

      // Convert XML API response to DOM Document (DOMParser constructor)
      let parser = new DOMParser()
      let xml = parser.parseFromString(response, 'application/xml')

      // Parsing Real Estate Data
      yearBuilt = xml.querySelector('yearBuilt').innerHTML
      purpose = xml.querySelector('useCode').innerHTML
      liveSqFt = xml.querySelector('finishedSqFt').innerHTML
      lotSqFt = xml.querySelector('lotSizeSqFt').innerHTML
      bedRoom = xml.querySelector('bedrooms').innerHTML
      bathRoom = xml.querySelector('bathrooms').innerHTML
      totalRoom = xml.querySelector('totalRooms').innerHTML
      soldDate = xml.querySelector('lastSoldDate').innerHTML
      soldPrice = xml.querySelector('lastSoldPrice').innerHTML
      comps = xml.querySelector('comparables').innerHTML
      neighValue = xml.querySelector('overview').innerHTML
      moreInfo = xml.querySelector('homedetails').innerHTML

      // Parse House Price and Mathematical Conversions
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
  document.querySelector("#price").style.color = "#f82249"
}

// console.log(document.querySelector("#currentUser").innerHTML, "currentUser")
function saveHouse() {
  console.log('Save House - CLICKED!');
  document.querySelector("#where").style.color = "white"
  document.querySelector("#price").style.color = "white"
  document.querySelector("#searchResults").style.color = "white"

  console.log('#saveHouse');
  console.log('zip', zip)


  fetch('saveHouse', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // 'user' : document.querySelector("#currentUser").innerHTML,
        'rawAddress': rawAddress,
        'zip': zip,
        'latitude': latitude,
        'longitude': longitude,
        'ZestimateAmt': ZestimateAmt,
        'yearBuilt': yearBuilt,
        'purpose': purpose,
        'liveSqFt': liveSqFt,
        'lotSqFt': lotSqFt,
        'bedRoom': bedRoom,
        'bathRoom': bathRoom,
        'totalRoom': totalRoom,
        'soldDate': soldDate,
        'soldPrice': soldPrice,
        'comps': comps,
        'neighValue': neighValue,
        'moreInfo': moreInfo
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


function mapFly() {
  map.flyTo({
    center: [longitude, latitude],
    speed: .2
  });
}

function mapZoom() {
  map.zoomTo(18, {
    duration: 16000
  })
}

function mapOn() {
  map.on('load', function() {
    map.resize();
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
}

function parseAddressByLength(rawAddress) {
  if (rawAddress.split(', ').length === 4) {
    streetAddress = rawAddress.split(', ')[0]
    console.log('streetAddress', streetAddress)
    city = rawAddress.split(', ')[1]
    console.log('city', city)
    state = rawAddress.split(', ')[2].split(' ')[0]
    console.log('state', state)
    zip = rawAddress.split(', ')[2].split(' ')[1]
    console.log('zip', zip);
  } else {
    streetAddress = rawAddress.split(', ')[1]
    console.log('streetAddress', streetAddress)
    city = rawAddress.split(', ')[2]
    console.log('city', city)
    state = rawAddress.split(', ')[3].split(' ')[0]
    console.log('state', state)
    zip = rawAddress.split(', ')[3].split(' ')[1]
    console.log('zip', zip);
  }
}

let trash = document.querySelectorAll(".fa-minus-square")
trash.forEach((element) => {
  element.addEventListener('click', function() {
    const rawAddress = this.parentNode.childNodes[5].innerText
    console.log("rawAddress", rawAddress)
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

// DEMO LOCATIONS
// .demoMatt, .demoWRox, .demoRos, .demoMel, .demoNew
// document.querySelector(".demoMatt").addEventListener("click", geoFindMe.bind(null, 42.278241, -71.070810), false);

// document.querySelector(".demoWRox").addEventListener("click", geoFindMe.bind(null, 42.261375, -71.151051), false);

// document.querySelector(".demoMatt").addEventListener('click', printlog.bind(null, event, "yay it worked!!!!!"))

// root.addEventListener('click', myPrettyHandler.bind(null, event, arg1, ... ));
// someObj.addEventListener("click", some_function.bind(null, arg1, arg2), false);


// document.querySelector(".demoMatt").onclick = geoFindMe(42.278241, -71.070810)
// document.querySelector(".demoMatt").addEventListener("click", geoFindMe(42.278241, -71.070810))

// document.querySelector(".demoMatt").onclick = printlog

// WORKING EXAMPLE OF PASSING ARG THROUGH TO addEventListener
// document.querySelector(".demoMatt").addEventListener("click", printlog.bind(null, "i hope this works"), false);
// function printlog(input){
//   let yay = input
//   console.log(yay);
//   console.log("haha");
// }

// Newton Coordinates
// latitude = 42.291881
// longitude = -71.184769

// Mattapan
// latitude = 42.278241
// longitude = -71.070810

// West Roxbury
// latitude = 42.261375
// longitude = -71.151051

// Melrose
// latitude = 42.444334
// longitude = -71.031010

// Roslindale
// latitude = 42.278579
// longitude = -71.129557

// Noon Meridian Sandwich Shop - Boston
// latitude = 42.357811
// longitude = -71.058137

// Providence Coordinates
// latitude = 41.8240
// longitude = -71.4128
//


// --------------------DEMO LOCATIONS-------------------------------------------
// --------------------DEMO LOCATIONS-------------------------------------------
// --------------------DEMO LOCATIONS-------------------------------------------
// .demoMatt, .demoWRox, .demoRos, .demoMel, .demoNew
// document.querySelector(".demoMatt").addEventListener("click", geoFindMe.bind(null, 42.278241, -71.070810), false);

// Demo Mattapan
document.querySelector(".demoMatt").addEventListener("click", function() {
  console.log('Mattapan - CLICKED!');
  const findMeStatus = document.querySelector('#findMeStatus');
  function success(position) {
    latitude = 42.278241
    longitude = -71.070810
    setTimeout(function(){ findMeStatus.textContent = '' }, 800);
    // Map Fly
    mapFly()
    // Reverse Geocoding (Mapbox API)
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ`)
      .then(response => response.json())
      .then(response => {
        document.querySelector("#where").style.fontSize = "22px"
        console.log(response.features[0].place_name)
        rawAddress = response.features[0].place_name
        console.log('length', rawAddress.split(', ').length)
        document.querySelector('#rawAddress').textContent = rawAddress
        //Parses Address Variables input into Zillow API
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
  document.querySelector("#where").style.color = "#f82249"
})

// Demo West Roxbury
document.querySelector(".demoWRox").addEventListener("click", function() {
  console.log('W Roxbury - CLICKED!');
  const findMeStatus = document.querySelector('#findMeStatus');
  function success(position) {
    latitude = 42.261375
    longitude = -71.151051
    setTimeout(function(){ findMeStatus.textContent = '' }, 800);
    // Map Fly
    mapFly()
    // Reverse Geocoding (Mapbox API)
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ`)
      .then(response => response.json())
      .then(response => {
        document.querySelector("#where").style.fontSize = "22px"
        console.log(response.features[0].place_name)
        rawAddress = response.features[0].place_name
        console.log('length', rawAddress.split(', ').length)
        document.querySelector('#rawAddress').textContent = rawAddress
        //Parses Address Variables input into Zillow API
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
  document.querySelector("#where").style.color = "#f82249"
})

// Demo Roslindale
document.querySelector(".demoRos").addEventListener("click", function() {
  console.log('Roslindale - CLICKED!');
  const findMeStatus = document.querySelector('#findMeStatus');
  function success(position) {
    latitude = 42.278579
    longitude = -71.129557
    setTimeout(function(){ findMeStatus.textContent = '' }, 800);
    // Map Fly
    mapFly()
    // Reverse Geocoding (Mapbox API)
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ`)
      .then(response => response.json())
      .then(response => {
        document.querySelector("#where").style.fontSize = "22px"
        console.log(response.features[0].place_name)
        rawAddress = response.features[0].place_name
        console.log('length', rawAddress.split(', ').length)
        document.querySelector('#rawAddress').textContent = rawAddress
        //Parses Address Variables input into Zillow API
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
  document.querySelector("#where").style.color = "#f82249"
})

// Demo Melrose
document.querySelector(".demoMel").addEventListener("click", function() {
  console.log('Melrose - CLICKED!');
  const findMeStatus = document.querySelector('#findMeStatus');
  function success(position) {
    latitude = 42.444334
    longitude = -71.031010
    setTimeout(function(){ findMeStatus.textContent = '' }, 800);
    // Map Fly
    mapFly()
    // Reverse Geocoding (Mapbox API)
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ`)
      .then(response => response.json())
      .then(response => {
        document.querySelector("#where").style.fontSize = "22px"
        console.log(response.features[0].place_name)
        rawAddress = response.features[0].place_name
        console.log('length', rawAddress.split(', ').length)
        document.querySelector('#rawAddress').textContent = rawAddress
        //Parses Address Variables input into Zillow API
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
  document.querySelector("#where").style.color = "#f82249"
})

// Demo Newton
document.querySelector(".demoNew").addEventListener("click", function() {
  console.log('Newton - CLICKED!');
  const findMeStatus = document.querySelector('#findMeStatus');
  function success(position) {
    latitude = 42.291881
    longitude = -71.184769
    setTimeout(function(){ findMeStatus.textContent = '' }, 800);
    // Map Fly
    mapFly()
    // Reverse Geocoding (Mapbox API)
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoiY29tcGxleGFwaWNlbnN1c2FuZG1hcCIsImEiOiJjanh6ZnBlYWEwMmptM2RvYW02ZTIwODk0In0.m4zyrwu_-34qVZNFVbKtCQ`)
      .then(response => response.json())
      .then(response => {
        document.querySelector("#where").style.fontSize = "22px"
        console.log(response.features[0].place_name)
        rawAddress = response.features[0].place_name
        console.log('length', rawAddress.split(', ').length)
        document.querySelector('#rawAddress').textContent = rawAddress
        //Parses Address Variables input into Zillow API
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
  document.querySelector("#where").style.color = "#f82249"
})

//
