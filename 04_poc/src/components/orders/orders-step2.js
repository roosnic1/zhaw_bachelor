import React, { Component, PropTypes } from 'react';
import {withRouter} from 'react-router';
import {RaisedButton, Subheader} from 'material-ui';
import {List, ListItem} from 'material-ui/List';
import moment from 'moment';


class OrdersStep2 extends Component {
  static propTypes = {
    orders: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.orders.reftime !== this.props.orders.reftime) {
      this.loadConnections(nextProps.orders);
    }
  }

  componentDidMount() {
    // Set current step
    localStorage.setItem('currentStep', 'step2');
    this.loadConnections();
  }

  loadConnections(orders = this.props.orders) {
    this.props.getConnections(orders.stops[1].name,orders.stops[2].name,orders.reftime,orders.task.pickup_handlingtime+orders.task.pickup_traveltime);
  }

  chooseConnection(connection) {
    const {orders} = this.props;
    const startTime = connection.from.departureTimestamp;
    const duration = moment.duration(connection.duration.replace('d','.'));
    Promise.all([
      this.props.updateStoptime(orders.tasktoken,orders.stops[1].id,{
       appointedtime: moment(startTime * 1000).format('HH:mm'),
       appointeddate: moment(startTime * 1000).format('YYYY-MM-DD'),
       timecondition: 0
      }),
      this.props.updateStopinfo(orders.tasktoken,orders.stops[1].id,{
        notepublic: 'Platform: ' + connection.from.platform
      }),
      this.props.updateStoptime(orders.tasktoken,orders.stops[2].id,{
        appointedtime: moment(startTime * 1000).add(duration).format('HH:mm'),
        appointeddate: moment(startTime * 1000).add(duration).format('YYYY-MM-DD'),
        timecondition: 0
      }),
      this.props.updateStopinfo(orders.tasktoken,orders.stops[2].id,{
        notepublic: 'Platform: ' + connection.to.platform
      }),
      this.props.updateStoptime(orders.tasktoken,orders.stops[3].id,{
        appointedtime: moment(startTime * 1000).add(duration).add(15,'m').format('HH:mm'),
        appointeddate: moment(startTime * 1000).add(duration).add(15,'m').format('YYYY-MM-DD'),
        timecondition: 1
      })
    ]).then((data) => {
      if(data.reduce((prev,curr) => prev && curr,true)) {
        this.props.router.push('/orders/step3');
      } else {
        // TODO: Error handling
      }
    });
    
  }

  renderConnections() {
    const { orders } = this.props;
    if(orders.connections.length > 0) {
      return (
        <List>
          <Subheader inset={true}>Connections</Subheader>
          {orders.connections.map(connection => {
            return (
              <ListItem
                primaryText={connection.from.station.name + ' - ' + connection.to.station.name + ' / Departure: ' + connection.from.departure}
                secondaryText={'Duration: ' + connection.duration + ' / Products: ' + connection.products.join()}
                onClick={this.chooseConnection.bind(this,connection)}
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
      </div>
    );
  }
}


export default withRouter(OrdersStep2);
