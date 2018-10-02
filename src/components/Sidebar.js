import React, { Component } from 'react';



class Sidebar extends Component {

    updateQuery = (query) => {
        this.setState({ query });
    }


    render() {
        const { query, currentList, li_click, handleSearch } = this.props

        return (
            <div className="sidebar">
                <input
                    type="text"
                    placeholder="Search here"
                    //Value reflects the state.
                    value={query}
                    //call the updateQuery method as text is entered
                    onChange={(event) => handleSearch(event.target.value, event)}
                />
                <ul>
                    {
                        currentList
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