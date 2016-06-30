import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Navigation } from 'react-router';

//import { notificationActions } from 'src/core/notification';
import { ordersActions } from 'src/core/orders';


export class Orders extends Component {
    static propTypes = {
        getProductId: PropTypes.func.isRequired,
        getPaymentId: PropTypes.func.isRequired,
        createTask: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {readyForTask: false};
    }

    componentWillMount() {
        this.getIds();
        console.log(this.props);
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

    getChildContext() {
        return {readyForTask: this.state.readyForTask}
    }



    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="orders">
                <div className="product-id">
                    <p>Task Token: { orders.tasktoken }</p>
                </div>
                <div className="orders__child">
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </div>
        );
    }
}

Orders.childContextTypes = {
    readyForTask: PropTypes.bool
};

export default connect(state => {
    return {
        orders: state.orders
    }
}, Object.assign({}, ordersActions))(Orders);
