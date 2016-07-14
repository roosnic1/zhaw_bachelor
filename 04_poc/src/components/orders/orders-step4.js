import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { RaisedButton } from 'material-ui';
import OrdersStopinfo from './orders-stopinfo';

// import { ordersActions } from 'src/core/orders';


class OrdersStep4 extends Component {
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
    localStorage.setItem('currentStep', 'step4');
  }

  orderTask() {
    this.props.orderTask(this.props.orders.tasktoken)
      .then(() => {
        // Continue to last step
        this.props.router.push('/orders/step4');
      });
  }

  renderOrderPackageInfos() {
    const { orders } = this.props;

    if (orders.stops.length > 0) {
      return (
        <div>
          adaas
        </div>
      );
    }
  }

  render() {

    return (
      <div className="orders-step4">
        {this.renderOrderPackageInfos()}
        <RaisedButton label="Order Task" primary={true} onClick={this.orderTask.bind(this)} />
      </div>
    );
  }
}


export default withRouter(OrdersStep4);
