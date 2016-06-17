import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';

//import { ordersActions } from 'src/core/orders';


class OrdersStart extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
    }

    createTask() {
        this.props.createTask(this.props.orders.productList[0].productid,this.props.orders.paymentList[0].paymentid)
            .then(() => {
                this.props.router.push('/orders/step1');
            });
    }

    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="orders-start">
                <h1>Start</h1>
                <button onClick={this.createTask.bind(this)} disabled={!this.context.readyForTask}>Create Task</button>
            </div>
        );
    }
}

OrdersStart.contextTypes = {
    readyForTask: PropTypes.bool
}

export default withRouter(OrdersStart);
