import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// import { notificationActions } from 'src/core/notification';
import { ordersActions } from 'src/core/orders';


export class Orders extends Component {
  static propTypes = {
    calculateTask: PropTypes.func.isRequired,
    children: PropTypes.object,
    createTask: PropTypes.func.isRequired,
    getPaymentId: PropTypes.func.isRequired,
    getProductId: PropTypes.func.isRequired,
    orders: PropTypes.object,
    router: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {readyForTask: false};
  }

  getChildContext() {
    return {readyForTask: this.state.readyForTask};
  }

  componentWillMount() {
    let currentTask;
    if (localStorage.getItem('currentTask') !== null) {
      currentTask = JSON.parse(localStorage.getItem('currentTask'));
    }
    this.getIds()
            .then(() => {
                // TODO: check if ids are loaded
              this.setState({readyForTask: true});

                // check if there is a current task.
              if (currentTask !== undefined) {
                return this.props.calculateTask(currentTask.tasktoken, currentTask.reftime);

              }
            })
            .then(() => {
              const step = localStorage.getItem('currentStep');
              if (step !== null && this.props.orders.tasktoken !== null) {
                this.props.router.push('/orders/' + step);
              } else {
                localStorage.removeItem('currentTask');
                localStorage.removeItem('currentStep');
                this.props.router.push('/orders');
              }
            });
  }

  getIds() {
    return Promise.all([
      this.props.getProductId(),
      this.props.getPaymentId()
    ]);
  }

  render() {
    const {
            orders
        } = this.props;

    return (
      <div className="orders">
        <div className="product-id">
          <p>Task Token: {orders.tasktoken}</p>
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
  };
}, Object.assign({}, ordersActions))(withRouter(Orders));
