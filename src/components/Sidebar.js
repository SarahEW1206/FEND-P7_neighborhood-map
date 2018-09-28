import React, { Component } from 'react';



class Sidebar extends Component {

    //create a state to hold the query value
    state = {
        query: '',
    }

    //Update the state based on what is typed into the input field 
    updateQuery = (query) => {
        this.setState({ query })
    }

    // clearQuery = () => {
    //     this.setState({ query: '' })
    // }

    render() {
        const { query } = this.state
        const { restaurants } = this.props

        return (
            <div className="sidebar">
                <input
                    type="text"
                    placeholder="Search here"
                    //Value reflects the state.
                    value={query}
                    //call the updateQuery method as text is entered
                    onChange={(event) => this.updateQuery(event.target.value)}
                />
                {/* <ul>
                    {
                        restaurants
                            .map(place => (
                                <li key={place.id}>
                                    {place.name}
                                </li>
                            )
                            )
                    }
                </ul> */}
            </div>
        )
    }
}

export default Sidebar