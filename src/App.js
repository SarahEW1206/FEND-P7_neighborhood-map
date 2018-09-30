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

    //When component is mounted, fetch foursquare data and set state to list of restaurants in data response.
    fetch("https://api.foursquare.com/v2/venues/explore?client_id=FSPSJP5YR4LWW2H3PXKNOMMEV3WALNUQREGMOOBHST2YDBNR&client_secret=C5Y3AG0LE0ACRHLEQ3BP2P3SAL3I12S25XTAVIAEG14ZX2RF&v=20180323&limit=20&ll=27.9427,-82.4518&radius=10000&query=restaurants")
      .then(res => res.json())
      .then((data) => {
        this.setState({ restaurants: data.response.groups[0].items })

        // Once the Google Maps API has finished loading, initialize the map
        this.getGoogleMaps().then((google) => {
          var amalie = { lat: 27.9427, lng: -82.4518 };
          this.map = new google.maps.Map(document.getElementById('map'), {
            center: amalie,
            zoom: 15,
          });

          this.state.restaurants.forEach(place => {
            let marker = new google.maps.Marker({
              position: { lat: place.venue.location.lat, lng: place.venue.location.lng },
              map: this.map
              // venue: place.venue,
              // id: place.venue.id,
              // name: place.venue.name,
              // animation: google.maps.Animation.DROP
            })

            this.infowindow = new google.maps.InfoWindow();


            let infoBox = '<div class="info_box">' +
              '<h4>' + place.venue.name + '</h4>' +
              '<p>' + place.venue.location.formattedAddress + '</p>' +
              '<p>' + place.venue.hereNow.summary + '</p>' +
              '</div>';
            marker.addListener('click', () => {
              if (marker.getAnimation() !== null) { marker.setAnimation(null); }
              else { marker.setAnimation(google.maps.Animation.BOUNCE); }
              setTimeout(() => { marker.setAnimation(null) }, 1500);
            });
            google.maps.event.addListener(marker, 'click', () => {
              this.infowindow.setContent(infoBox);
              // map.setZoom(13);
              this.map.setCenter(marker.position);
              this.infowindow.open(this.map, marker);
              this.map.panBy(0, -125);
            });

          });

        })
      })
      .catch((error) => {
        alert('Sorry, there has been an error' + error);
      });



  };

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
