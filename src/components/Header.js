import React, { Component } from 'react';
import Logo from '../images/tbl.png'


class Header extends Component {



    render() {
        const { showing } = this.props
        return (
            <div className="header">
                <img className="boltsPatchLogo" src={Logo} alt={"Tampa Bay Lightning Logo"} />
                <h1>Go Bolts!</h1>

                {showing ? <button onClick={this.props.handleMenuToggle}>Hide List</button> :
                    <button onClick={this.props.handleMenuToggle}>Show List</button>
                }
            </div>
        )
    }
}

export default Header

