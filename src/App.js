import React, { Component } from 'react';
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import './App.css';

class App extends Component {

  state = {
    restaurants: [],
  }


  //https://stackoverflow.com/questions/48493960/using-google-map-in-react-component
  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(window.google);
          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        const API = 'AIzaSyD34DPhrN4kubtEh_1fxxznrNqR0wb3JE0';
        const libraries = 'places'
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&libraries=${libraries}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  //----------------------------------------------------------//

  componentWillMount() {
    // Start Google Maps API loading since we know we'll soon need it
    // Remember this returns a promise.
    this.getGoogleMaps();
  }

  //----------------------------------------------------------//

  componentDidMount() {
    // Once the Google Maps API has finished loading, initialize the map

    var map;
    var infowindow;

    this.getGoogleMaps().then((google) => {

      var amalie = { lat: 27.9427, lng: -82.4518 };

      map = new google.maps.Map(document.getElementById('map'), {
        center: amalie,
        zoom: 15
      });

      infowindow = new google.maps.InfoWindow();

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: amalie,
        radius: 500,
        type: ['restaurant'],
      }, setMarkers);

      function setMarkers(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            add(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: placeLoc
        });

        google.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent(`<h3>${place.name}</h3>`);
          infowindow.open(map, this);
        });
      }

      let restList = [];

      function add(obj) {
        restList.push(obj)
      };

      this.setState({ restaurants: restList })
      console.log(this.state.restaurants)

    });

  }

  //----------------------------------------------------------//


  render() {

    return (
      <div className="App">
        <Sidebar restaurants={this.state.restaurants} />
        <Map />
      </div>
    );
  }
}

export default App;
