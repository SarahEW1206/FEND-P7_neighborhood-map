import React, { Component } from 'react';



class Sidebar extends Component {


    render() {
        const { query, currentList, listClick, listEnter, handleSearch, showing } = this.props

        return (

            <section>
                {showing &&
                    <div role="menu" className="sidebar">
                        <p className="sidebar-text">Places to dine around Amalie Arena, home of the Tampa Bay Lightning!</p>
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
                                        <li tabIndex="0" onClick={() => { listClick(place) }} onKeyPress={(event) => { listEnter(event, place) }} key={place.venue.id}>
                                            {place.venue.name}
                                        </li>
                                    )
                                    )
                            }
                        </ul>


                    </div>}
            </section>

        )
    }
}

export default Sidebar