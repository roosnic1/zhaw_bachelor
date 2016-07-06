import React, { Component, PropTypes } from 'react';
import {withRouter} from 'react-router';
import {RaisedButton, Subheader} from 'material-ui';
import {List, ListItem} from 'material-ui/List';
import OrdersOverview from './orders-overview';

// import { ordersActions } from 'src/core/orders';


class OrdersStep2 extends Component {
  static propTypes = {
    orders: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    // Set current step
    localStorage.setItem('currentStep', 'step2');
    const { orders } = this.props;
    this.props.getConnections(orders.stops[1].name,orders.stops[2].name,orders.reftime * 1000,orders.task.pickup_handlingtime+orders.task.pickup_traveltime)
      .then(() => {
        console.log(orders.connections);
      });
  }

  chooseConnection() {
    /*this.props.orderTask(this.props.orders.tasktoken)
      .then(() => {
        // Continue to last step
      });*/
    this.props.router.push('/orders/step3');
  }

  renderConnections() {
    const { orders } = this.props;
    console.log(orders.connections.length);
    if(orders.connections.length > 0) {
      return (
        <List>
          <Subheader inset={true}>Connections</Subheader>
          {orders.connections.map(connection => {
            return (
              <ListItem
                primaryText={connection.from.station.name + ' - ' + connection.to.station.name + ' / Departure: ' + connection.from.departure}
                secondaryText={'Duration: ' + connection.duration + ' / Products: ' + connection.products.join()}
              />
            );
          })}
        </List>
      )
    }
  }


  render() {
    return (
      <div className="orders-step2">
        {this.renderConnections()}
        <RaisedButton label="Order Task" primary={true} onClick={this.chooseConnection.bind(this)} />
      </div>
    );
  }
}


export default withRouter(OrdersStep2);
