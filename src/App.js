import React, { Component } from 'react';
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Icon from './images/hockeystick.png'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      currentList: [],
      query: '',
      markers: [],
      infoboxes: [],
      showSidebar: true
    }

    //Bind these functions to this component to preserve the value of "this" when passed down.
    this.listClick = this.listClick.bind(this);
    this.listEnter = this.listEnter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.filterList = this.filterList.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this)

  }

  //Set state of showSidebar to true or false to show or hide sidebar. 
  handleMenuToggle() {
    if (this.state.showSidebar) {
      this.setState({ showSidebar: false });
    } else {
      this.setState({ showSidebar: true })
    }
  }

  //From https://stackoverflow.com/questions/48493960/using-google-map-in-react-component
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
    // //From https://stackoverflow.com/questions/48493960/using-google-map-in-react-component
    this.getGoogleMaps();
  }

  listClick(place) {
    let marker = this.state.markers.filter(m => m.venue.id === place.venue.id)[0];
    let info_obj = this.state.infoboxes.filter(i => i.id === place.venue.id)[0];
    let infoBox = info_obj
    if (marker && infoBox) {
      if (marker.getAnimation() !== null) { marker.setAnimation(null); }
      else { marker.setAnimation(this.google.maps.Animation.BOUNCE); }
      setTimeout(() => { marker.setAnimation(null) }, 1500);

      this.infowindow.setContent(infoBox.contents);
      this.map.setCenter(marker.position);
      this.infowindow.open(this.map, marker);
      this.map.panBy(0, -125);
    }
  }

  listEnter(event, place) {
    if (event.key === "Enter") {
      this.listClick(place)
    }
  }
  //----------------------------------------------------------//

  //Update the state based on what is typed into the input field and call the filterList function.
  handleSearch = (query, event) => {
    if (!query) {
      this.setState({ currentList: this.state.restaurants })
      this.setState({ query: '' });
    } else {
      this.setState({ query }, this.filterList(event));
    }

    // Then set marker visibility to reflect the list. If marker object venue.name includes the query string, then it should be visible.
    // This bit of code from: https://github.com/ryanwaite28/udacity-fend-p7
    this.state.markers.forEach(m => {
      m.venue.name.toLowerCase().includes(query.toLowerCase()) ?
        m.setVisible(true) :
        m.setVisible(false);
    });
  }

  //Filter the list to reflect the search query
  // This bit of code from: https://codepen.io/pjmtokyo/pen/ZGVjVV?editors=0010
  filterList = (event) => {
    //create a var called updatedList and make it initially equal to state.restaurants. This is to avoid modifying restaurants directly, so that we can use it to reset the list each time.
    var updatedList = this.state.restaurants;
    //then filter the updatedList 
    updatedList = updatedList.filter(function (item) {
      return item.venue.name.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    //Then set state of currentList to reflect the filtered list
    //Sidebar component will map through this to build the list
    this.setState({ currentList: updatedList });


  }


  //----------------------------------------------------------//


  componentDidMount() {

    //When component is mounted, fetch foursquare data and set state to list of restaurants in data response.
    fetch("https://api.foursquare.com/v2/venues/explore?client_id=FSPSJP5YR4LWW2H3PXKNOMMEV3WALNUQREGMOOBHST2YDBNR&client_secret=C5Y3AG0LE0ACRHLEQ3BP2P3SAL3I12S25XTAVIAEG14ZX2RF&v=20180323&limit=20&ll=27.9427,-82.4518&radius=10000&query=restaurants")
      .then(res => res.json())
      //after Foursquare data comes back, set states accordingly and then initialize the map
      .then((data) => {
        this.setState({ restaurants: data.response.groups[0].items });
        this.setState({ currentList: data.response.groups[0].items })
        // Once the Google Maps API has finished loading, initialize the map
        // From https://stackoverflow.com/questions/48493960/using-google-map-in-react-component
        this.getGoogleMaps().then((google) => {
          var amalie = { lat: 27.9427, lng: -82.4518 };
          this.google = google;
          this.map = new google.maps.Map(document.getElementById('map'), {
            center: amalie,
            zoom: 14,
            //Styling from snazzymaps: https://snazzymaps.com/style/1927/blue
            styles: [
              {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#444444"
                  }
                ]
              },
              {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                  {
                    "color": "#f2f2f2"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                  {
                    "saturation": -100
                  },
                  {
                    "lightness": 45
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                  {
                    "visibility": "simplified"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                  {
                    "color": "#002868"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              }
            ]
          });

          //Initialize the info window
          this.infowindow = new google.maps.InfoWindow();

          //Create empty arrays to hold on to our marker and info box objects, then set marker and infoboxex states to the contents of those arrays.
          let markers = [];
          this.setState({ markers: markers })
          let info_boxes = [];
          this.setState({ infoboxes: info_boxes })

          // For each restaurant object in the restaurants state, create a corresponding marker.
          // Code from https://github.com/ryanwaite28/udacity-fend-p7
          this.state.restaurants.forEach(place => {
            let marker = new google.maps.Marker({
              position: { lat: place.venue.location.lat, lng: place.venue.location.lng },
              map: this.map,
              venue: place.venue,
              animation: google.maps.Animation.DROP,
              icon: Icon
            })

            let infoBox = '<div class="info_box">' +
              '<h2>' + place.venue.name + '</h2>' +
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
              this.map.setZoom(15);
              this.map.setCenter(marker.position);
              this.infowindow.open(this.map, marker);
              this.map.panBy(0, -125);
            });

            markers.push(marker);
            info_boxes.push({ id: place.venue.id, name: place.venue.name, contents: infoBox });
          });
        })

      })
      .catch((error) => {
        alert('Sorry, there has been an error getting your map: ' + error);
      });
  };


  render() {
    console.log(this.state.markers)
    return (
      <div className="App">
        <Header
          handleMenuToggle={this.handleMenuToggle}
          showing={this.state.showSidebar}
        />
        <div className="container">
          <Sidebar
            currentList={this.state.currentList}
            listClick={this.listClick}
            listEnter={this.listEnter}
            handleSearch={this.handleSearch}
            markers={this.state.markers}
            showing={this.state.showSidebar}
            query={this.state.query} />
          <Map />
        </div>
      </div>
    );
  }
}

export default App;
