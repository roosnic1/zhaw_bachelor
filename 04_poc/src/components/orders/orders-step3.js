import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { RaisedButton } from 'material-ui';
import OrdersOverview from './orders-overview';
import OrdersStopinfo from './orders-stopinfo';

// import { ordersActions } from 'src/core/orders';


class OrdersStep3 extends Component {
  static propTypes = {
    orderTask: PropTypes.func.isRequired,
    orders: PropTypes.object,
    updateStopinfo: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    // Set current step
    localStorage.setItem('currentStep', 'step3');
  }

  orderTask() {
    this.props.orderTask(this.props.orders.tasktoken)
      .then(() => {
        // Continue to last step
      });
  }

  renderOrderStopInfos() {
    const { orders } = this.props;

    if (orders.stops.length > 0) {
      return (
        <div>
          <OrdersStopinfo stop={orders.stops[0]} tasktoken={orders.tasktoken} updateStopinfo={this.props.updateStopinfo} />
          <OrdersStopinfo stop={orders.stops[3]} tasktoken={orders.tasktoken} updateStopinfo={this.props.updateStopinfo} />
        </div>
      );
    }
  }

  render() {
    const { orders } = this.props;

    return (
      <div className="orders-step3">
        <h2>Order Status</h2>
        <OrdersOverview task={orders.task} stops={orders.stops} reftime={orders.reftime * 1000} />
        {this.renderOrderStopInfos()}
        <RaisedButton label="Order Task" primary={true} onClick={this.orderTask.bind(this)} />
      </div>
    );
  }
}


export default withRouter(OrdersStep3);