import React, { Component } from 'react';
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
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
    this.li_click = this.li_click.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.filterList = this.filterList.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this)
  }


  handleMenuToggle() {
    if (this.state.showSidebar) {
      this.setState({ showSidebar: false });
    } else {
      this.setState({ showSidebar: true })
    }
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


  li_click(place) {
    let marker = this.state.markers.filter(m => m.id === place.venue.id)[0];
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
  //----------------------------------------------------------//

  //Update the state based on what is typed into the input field 

  //TODO: turn this into a ternary??
  handleSearch = (query, event) => {
    if (!query) {
      this.setState({ currentList: this.state.restaurants })
      this.setState({ query: '' });

    } else {
      this.setState({ query }, this.filterList(event));
    }

    this.state.markers.forEach(m => {
      m.name.toLowerCase().includes(query) ?
        m.setVisible(true) :
        m.setVisible(false);
    });
  }

  // clearQuery = () => {
  //   this.setState({ query: '' })
  // }

  filterList = (event) => {
    var updatedList = this.state.restaurants;
    updatedList = updatedList.filter(function (item) {
      return item.venue.name.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({ currentList: updatedList });


  }


  //----------------------------------------------------------//


  componentDidMount() {

    //When component is mounted, fetch foursquare data and set state to list of restaurants in data response.
    fetch("https://api.foursquare.com/v2/venues/explore?client_id=FSPSJP5YR4LWW2H3PXKNOMMEV3WALNUQREGMOOBHST2YDBNR&client_secret=C5Y3AG0LE0ACRHLEQ3BP2P3SAL3I12S25XTAVIAEG14ZX2RF&v=20180323&limit=20&ll=27.9427,-82.4518&radius=10000&query=restaurants")
      .then(res => res.json())
      .then((data) => {
        this.setState({ restaurants: data.response.groups[0].items });
        this.setState({ currentList: data.response.groups[0].items })

        // Once the Google Maps API has finished loading, initialize the map
        this.getGoogleMaps().then((google) => {
          var amalie = { lat: 27.9427, lng: -82.4518 };
          this.google = google;
          this.map = new google.maps.Map(document.getElementById('map'), {
            center: amalie,
            zoom: 15,
          });
          this.infowindow = new google.maps.InfoWindow();

          let markers = [];
          this.setState({ markers: markers })
          let info_boxes = [];
          this.setState({ infoboxes: info_boxes })


          this.state.restaurants.forEach(place => {
            let marker = new google.maps.Marker({
              position: { lat: place.venue.location.lat, lng: place.venue.location.lng },
              map: this.map,
              venue: place.venue,
              id: place.venue.id,
              name: place.venue.name,
              // animation: google.maps.Animation.DROP
            })

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

            markers.push(marker);

            info_boxes.push({ id: place.venue.id, name: place.venue.name, contents: infoBox });
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
        <Header
          handleMenuToggle={this.handleMenuToggle}
          showing={this.state.showSidebar}
        />
        <div className="container">
          <Sidebar
            currentList={this.state.currentList}
            li_click={this.li_click}
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
