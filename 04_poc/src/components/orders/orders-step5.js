import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';


class OrdersStep5 extends Component {
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
      <div className="orders-step5">
        <h2>Status</h2>
        <a href={orders.taskStatus.statusurl} target="_blank">Status</a>
        <br />
        <a href={orders.taskStatus.confirmationpdf} target="_blank">Confirmation PDF</a>
      </div>
    );
  }
}


export default withRouter(OrdersStep5);
