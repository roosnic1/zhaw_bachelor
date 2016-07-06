import React, { Component, PropTypes } from 'react';
import {Paper, DatePicker, TimePicker} from 'material-ui';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';


class OrdersOverview extends Component {
  static propTypes = {
    orders: PropTypes.object
  };

  /*renderOverview() {
    const { task, reftime } = this.props;
    if (task !== null) {
      return (
        <div className="orders-overview__task">
          <p>Costs (incl. VAT): {task.costtotalincludingvat}</p>
          <p>Date: {moment(reftime).format('DD.MM.YYYY')}</p>
          <p>Pickup: {moment(reftime).format('HH:mm')} - {moment(reftime).add(task.pickup_handlingtime, 'minutes').format('HH:mm')}</p>
          <p>ETA: {moment(reftime).add(task.pickup_handlingtime + task.pickup_traveltime + task.delivery_traveltime, 'minutes').format('HH:mm')}</p>
        </div>
      );
    }
  }*/

  handleDateChange(event, date) {
    const { orders } = this.props;
    const reftime = new Date(orders.reftime);
    const datetime = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
      reftime.getHours(), reftime.getMinutes(), reftime.getSeconds());
    this.props.updateReftime(orders.tasktoken,datetime.getTime());
  }

  handleTimeChange(event, time) {
    const { orders } = this.props;
    const reftime = new Date(orders.reftime);
    const datetime = new Date(reftime.getFullYear(), reftime.getMonth(), reftime.getDate(),
      time.getHours(), time.getMinutes(), time.getSeconds());
    this.props.updateReftime(orders.tasktoken,datetime.getTime());
  }

  renderDatetime() {
    const { reftime } = this.props.orders;
    return (
      <div className="orders-overview__date">
        <DatePicker hintText="Date" value={new Date(reftime)} onChange={this.handleDateChange.bind(this)} />
        <TimePicker hintText="Time" format="24hr" value={new Date(reftime)} onChange={this.handleTimeChange.bind(this)} />
      </div>
    )
  }

  renderStops() {
    const { stops } = this.props.orders;
    return (
      <div className="orders-overview__stops">
        {stops.map((stop,index) => {
          if (stop.alias) {
            return [<div className="stop train-stop">{stop.alias}</div>, <FontAwesome className="symbol-stop" name={ index===1 ? "train" : "bicycle"} size="2x" />];
          } else {
            return [<div className="stop street-stop">{stop.street} {stop.housenumber} <br />{stop.city} {stop.zip} {stop.isocode}</div>, <FontAwesome className={index < stops.length-1 ? 'symbol-stop' : 'symbol-hide'}  name="bicycle" size="2x" />];
          }
        })}
    </div>
    )
  }

  render() {
    const { orders } = this.props;
    return (
      <Paper zDepth={2} className="orders-overview">
        <p>Task Token: {orders.tasktoken}</p>
        {this.renderStops()}
        {this.renderDatetime()}
      </Paper>
    );
  }
}


export default OrdersOverview;
