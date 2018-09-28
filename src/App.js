import React, { Component } from 'react';
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import './App.css';

class App extends Component {



  getLocations = () => {
    console.log("locations!")
  }


  render() {

    return (
      <div className="App">
        <Sidebar />
        <Map getLocations={this.getLocations} />
      </div>
    );
  }
}

export default App;
