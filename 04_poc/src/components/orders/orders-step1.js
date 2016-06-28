import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'


//import { ordersActions } from 'src/core/orders';


class OrdersStep1 extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);

    }
    

    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="orders-step1">
                <h1>Step 1</h1>
            </div>
        );
    }
}


export default withRouter(OrdersStep1);
