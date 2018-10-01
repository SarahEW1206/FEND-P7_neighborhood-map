import React, { Component } from 'react';



class Sidebar extends Component {

    updateQuery = (query) => {
        this.setState({ query });
    }


    render() {
        const { query, restaurants, li_click, onInput } = this.props

        return (
            <div className="sidebar">
                <input
                    type="text"
                    placeholder="Search here"
                    //Value reflects the state.
                    value={query}
                    //call the updateQuery method as text is entered
                    onChange={(event) => onInput(event.target.value, event)}
                />
                <ul>
                    {
                        restaurants
                            .map(place => (
                                <li onClick={() => { li_click(place) }} key={place.venue.id}>
                                    {place.venue.name}
                                </li>
                            )
                            )
                    }
                </ul>

            </div>
        )
    }
}

export default Sidebar