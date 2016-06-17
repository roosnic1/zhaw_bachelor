import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

//import { notificationActions } from 'src/core/notification';
import { ordersActions } from 'src/core/orders';


export class Orders extends Component {
    static propTypes = {
        getProductId: PropTypes.func.isRequired,
        getPaymentId: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {readyForTask: false};

    }

    componentWillMount() {
        this.getIds();
    }

    //renderSelect()

    getIds() {
        Promise.all([
            this.props.getProductId(),
            this.props.getPaymentId()
        ]).then(() => {
            this.setState({readyForTask: true});
            console.log('Got all the infos');
        });
    }

    createTask() {
        this.props.createTask(this.props.orders.productList[0].productid,this.props.orders.paymentList[0].paymentid);
    }

    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="product-id">
                <p>Product Alias: { orders.productList[0] ? orders.productList[0].alias : "No Product" }</p>
                <p>Payment Alias: { orders.paymentList[0] ? orders.paymentList[0].alias : "No Payment" }</p>
                
                <button onClick={this.createTask.bind(this)} disabled={!this.state.readyForTask}>Create Task</button>
                <p>Task Token: { orders.taskToken }</p>
            </div>
        );
    }
}

export default connect(state => {
    return {
        orders: state.orders
    }
}, Object.assign({}, ordersActions))(Orders);
