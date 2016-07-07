import React, { Component, PropTypes } from 'react';
import {Paper, DatePicker, TimePicker, FlatButton} from 'material-ui';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';


class OrdersOverview extends Component {
  static propTypes = {
    orders: PropTypes.object
  };
  
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

  handleTaskDelete() {
    this.props.deleteTask();
    this.props.router.push('/');
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
    return (
      <Paper zDepth={2} className="orders-overview">
        <div className="orders-overview__taskinfo">
          <span>Task Token: {this.props.orders.tasktoken}</span>
          <FlatButton label="Delete Task" secondary={true} onClick={this.handleTaskDelete.bind(this)} />
        </div>
        {this.renderStops()}
        {this.renderDatetime()}
      </Paper>
    );
  }
}


export default OrdersOverview;
