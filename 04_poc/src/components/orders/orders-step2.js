import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { TextField, RaisedButton } from 'material-ui'
import OrdersOverview from './orders-overview';

//import { ordersActions } from 'src/core/orders';


class OrdersStep2 extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);
        console.log(OrdersOverview);

    }

    componentDidMount() {
        //
    }

    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="orders-step2">
                <h2>Order Status</h2>
                <OrdersOverview task={orders.task} stops={orders.stops} reftime={orders.reftime * 1000}/>
            </div>
        );
    }
}


export default withRouter(OrdersStep2);
