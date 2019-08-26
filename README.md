![Preview](public/img/preview.png)

# 🏠 House-Pricing-GPS-App

### Purpose:

- Full-stack app that allows users to find their location and find the price of the nearest house.
- Users can save their favorite houses.

## How the app works:

- HTML geolocation to obtain user's latitude and longitude
- Mapbox API: reverse geolocation to convert lat/lon to raw addresses
- Parse raw address into street address, city, state
- Zillow API: input street address, city, state to output house price estimate, and other data

## Key Features

- GPS Positioning, House/Neighborhood Data, Livability Score, StreetView, User-Authentication, and Database for User's Favorite Houses.

## FAQs

- How do I use this app?
  - 1. "Signup" for an account
  - 2. Click "Find Nearest House"
  - 3. Click "Get House Price"
  - 4. Click "Save House"
  - 5. Scroll down to the data
  - 6. Click "Link" for one of your FAVORITE houses and get Interactive StreetView Images, Neighborhood surveys, and much more housing data.
  - 7. Login to use again.
  - 8. Enjoy~!

- I'm in a office building and am not able to get house prices?
  - Try out "Demo Mode" from the menu drop-down to use preset address buttons to see how using it in the wild is like.

- I found a great deal! Can I buy this house today?
  - Sounds like an excellent start! Please research the specific house, loan details, and your finances before moving forward in your search for a house to call your own. To get you started with learning more about your dream house, links are provided in the House Details pages (see FAQ Q1, step 6). Prices shown are estimates only; not all houses listed are for sale. Best of luck in your search! (Me too!)

- Can I input a custom address for a house to find out its price?
  - Inputting custom addresses is a feature that did not make it into this development cycle. Send a text to the developer at 781.627.5157 to show your interest for this possible future feature.

- I have a suggestion for the next version of House Price GPS. What can I do?
  - I appreciate any feedback to learn and grow as a software engineer. Send me a text at 781.627.5157 and we can connect.

- I'd like to hire you.
  - Woaah! I appreciate that. Speak with me in person, text me at 781.627.5157, or message me on LinkedIn. Let's talk :) ￼

## Technologies Used

- MAPBOX
- MongoDB
- JSON
- NodeJS
- ExpressJS
- Zillow
- XML
- Passport

## Other Features
- Embed Code Generator | Embedly https://embed.ly/code
- Instant Street View https://www.instantstreetview.com/
- AARP Livability Index https://livabilityindex.aarp.org/
- 3D Buildings https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/
- Live Zoom https://docs.mapbox.com/mapbox-gl-js/example/change-building-color-based-on-zoom-level/
- Set pitch and bearing https://docs.mapbox.com/mapbox-gl-js/example/set-perspective/
- Fly to a location https://docs.mapbox.com/mapbox-gl-js/example/flyto/

## Ideas for Future Versions:
- look at REAL ESTATE Sites for CSS ideas/inspiration
- add Directions from INPUT, output Est Commute/Driving Time (ex. to work)/draw route
  https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/
  https://docs.mapbox.com/help/how-mapbox-works/directions/
- live route https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
- add a marker/point https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/
- add INPUT where you can input address to check price ZestimateAmt
- Restyle the Mapbox Logo Bar.
  Change the default position for attribution
  https://docs.mapbox.com/mapbox-gl-js/example/attribution-position/
- check price by using mouse to get latitude and longitude coordinates
  https://docs.mapbox.com/mapbox-gl-js/example/mouse-position/
- SCROLL THOUGH FAVORITES and FLY w/ MAP
  Fly to a location based on scroll position
  https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
- add Navigation functionality (possible?)
- for Demo Day: add "Live Preview Trip"/"Simulation Trip"

## cool extras:
- https://docs.mapbox.com/mapbox-gl-js/example/animate-point-along-route/
- https://docs.mapbox.com/mapbox-gl-js/example/animate-camera-around-point/
- https://docs.mapbox.com/mapbox-gl-js/example/game-controls/
- https://docs.mapbox.com/mapbox.js/example/v1.0.0/custom-legend/
- https://docs.mapbox.com/mapbox.js/example/v1.0.0/marker-popup-onload/

### References:
- Fetching and Reading XML Data (6:23) https://www.youtube.com/watch?v=MDAWie2Sicc
- https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
- https://developer.mozilla.org/en-US/docs/Web/XPath
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_using_XPath_in_JavaScript
- https://developer.mozilla.org/en-US/docs/Archive/JXON
- https://developer.mozilla.org/en-US/docs/Web/API/Body/json
- Prevent CORS error https://github.com/Rob--W/cors-anywhere/#client
  Add https://cors-anywhere.herokuapp.com/ before fetched URL
- HTML5 Geolocation https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
