import React, { Component } from 'react';
import Logo from '../images/tbl.png'


class Header extends Component {



    render() {
        const { showing } = this.props
        return (
            <header className="header">
                <img className="boltsPatchLogo" src={Logo} alt={"Tampa Bay Lightning Logo"} />
                <h1>Hungry for Hockey?</h1>
                {showing ? <button onClick={this.props.handleMenuToggle}>Hide List</button> :
                    <button onClick={this.props.handleMenuToggle}>Show List</button>
                }
            </header>
        )
    }
}

export default Header

