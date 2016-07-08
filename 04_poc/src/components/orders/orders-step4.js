import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';


class OrdersStep4 extends Component {
  static propTypes = {
    orders: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    // Set current step
  }
  

  render() {
    const {orders} = this.props;
    return (
      <div className="orders-step4">
        <h2>Status</h2>
        <a href={orders.taskStatus.statusurl} target="_blank">Status</a>
        <a href={orders.taskStatus.confirmationpdf} target="_blank">Confirmation PDF</a>
      </div>
    );
  }
}


export default withRouter(OrdersStep4);
