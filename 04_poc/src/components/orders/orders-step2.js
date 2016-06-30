import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { TextField, RaisedButton } from 'material-ui'
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers';


//import { ordersActions } from 'src/core/orders';


class OrdersStep2 extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);

        this.state = {
        };
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
            </div>
        );
    }
}


export default withRouter(OrdersStep2);
