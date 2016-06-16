import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';


export class Orders extends Component {

    render() {

        return (
            <div className="home">
                <h1>Imagine Cargo</h1>
                <ul>
                    <li><Link to="/orders">Order</Link></li>
                </ul>
            </div>
        );
    }
}

export default Orders;
