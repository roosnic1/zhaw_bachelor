import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { RaisedButton } from 'material-ui';
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
        this.props.router.push('/orders/step4');
      });
  }

  renderOrderStopInfos() {
    const { orders } = this.props;

    if (orders.stops.length > 0) {
      return (
        <div>
          {orders.stops.map(stop => {
           if(!stop.alias) {
             return <OrdersStopinfo stop={stop} tasktoken={orders.tasktoken} updateStopinfo={this.props.updateStopinfo} />
           }
          })}
        </div>
      );
    }
  }

  render() {

    return (
      <div className="orders-step3">
        {this.renderOrderStopInfos()}
        <RaisedButton label="Order Task" primary={true} onClick={this.orderTask.bind(this)} />
      </div>
    );
  }
}


export default withRouter(OrdersStep3);
