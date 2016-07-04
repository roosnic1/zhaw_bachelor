import React, { Component, PropTypes } from 'react';
import moment from 'moment';


class OrdersOverview extends Component {
  static propTypes = {
    reftime: PropTypes.number,
    stops: PropTypes.array,
    task: PropTypes.object
  };

  renderOverview() {
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
  }

  render() {
    const { stops } = this.props;
    return (
      <div className="orders-overview">
        <div className="orders-overview__stops">
          {stops.map(stop => {
            if (stop.alias) {
              return <p>{stop.alias}</p>;
            } else {
              return <p>{stop.street} {stop.housenumber}, {stop.city} {stop.zip}, {stop.isocode}</p>;
            }
          })}
        </div>
        {this.renderOverview()}
      </div>
    );
  }
}


export default OrdersOverview;
