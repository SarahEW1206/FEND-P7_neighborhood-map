import React, { Component } from 'react';


//https://stackoverflow.com/questions/48493960/using-google-map-in-react-component
class Map extends Component {
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
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
                script.async = true;
                document.body.appendChild(script);
            });
        }

        // Return a promise for the Google Maps API
        return this.googleMapsPromise;
    }

    componentWillMount() {
        // Start Google Maps API loading since we know we'll soon need it
        this.getGoogleMaps();
    }

    componentDidMount() {
        // Once the Google Maps API has finished loading, initialize the map
        this.getGoogleMaps().then((google) => {
            const amalie = { lat: 27.9427, lng: -82.4518 };
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center: amalie,
            });
            const marker = new google.maps.Marker({
                position: amalie,
                map: map
            });
        });
    }



    render() {
        this.props.getLocations();
        return (
            <div id="map" ></div>
        )
    }
}

export default Map

