import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

//import { notificationActions } from 'src/core/notification';
import { ordersActions } from 'src/core/orders';


export class Orders extends Component {
    static propTypes = {
        getProductId: PropTypes.func.isRequired,
    };

    componentWillMount() {
        //this.props.registerListeners();
    }

    render() {
        const {
            getProductId,
            orders
        } = this.props;

        return (
            <div className="product-id">
                <button onClick={getProductId}>Get Product Id</button>
                <p>Product Alias: { orders.list[0] ? orders.list[0].alias : "No Product" }</p>
            </div>
        );
    }
}

export default connect(state => {
    console.log(state);
    return {
        orders: state.orders
    }
}, Object.assign({}, ordersActions))(Orders);
