import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Navigation, withRouter } from 'react-router';

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
        let currentTask;
        if(localStorage.getItem('currentTask') !== null) {
            currentTask = JSON.parse(localStorage.getItem('currentTask'));
        }
        this.getIds()
            .then(() => {
                //TODO: check if ids are loaded
                this.setState({readyForTask: true});

                //check if there is a current task.
                console.log(currentTask);
                 if(currentTask !== undefined) {
                     return Promise.all([
                         this.props.getStopList(currentTask.tasktoken),
                         this.props.calculateTask(currentTask.tasktoken)
                     ]);

                 }
            })
            .then(() => {
                const step = localStorage.getItem('currentStep');
                if(step !== null && this.props.orders.tasktoken !== null) {
                    console.log('loaded stoplist and calculated task');
                    this.props.router.push('/orders/' + step);
                } else {
                    console.log('go to start');
                    localStorage.removeItem('currentTask');
                    localStorage.removeItem('currentStep');

                    this.props.router.push('/orders');
                }
            });
    }

    //renderSelect()

    getIds() {
        return Promise.all([
            this.props.getProductId(),
            this.props.getPaymentId()
        ]);
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
}, Object.assign({}, ordersActions))(withRouter(Orders));
