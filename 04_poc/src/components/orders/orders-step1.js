import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

//import { ordersActions } from 'src/core/orders';


export default class OrdersStep1 extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);
        console.log('Step1');
        console.log(this.props);
        //this.state = {readyForTask: false};
    }

    componentWillMount() {
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

//export default OrdersStep1;

/*export default connect(state => {
    return {
        orders: state.orders
    }
}, Object.assign({}, ordersActions))(Orders);*/
