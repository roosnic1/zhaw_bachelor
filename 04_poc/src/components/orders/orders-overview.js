import React, { Component, PropTypes } from 'react';
import { TextField, RaisedButton } from 'material-ui'
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers';
import moment from 'moment';


//import { ordersActions } from 'src/core/orders';


class OrdersOverview extends Component {
    static propTypes = {
        task: PropTypes.object,
        reftime: PropTypes.number,
        stops: PropTypes.array
    };

    render() {
        const {
            task,
            stops,
            reftime
        } = this.props;

        return (
            <div className="orders-overview">
                <div className="orders-overview__stops">
                    {stops.map(stop => {
                        if(stop.alias) {
                            return <p>{stop.alias}</p>;
                        } else {
                            return <p>{stop.street} {stop.housenumber}, {stop.city} {stop.zip}, {stop.isocode}</p>;
                        }
                    })}
                </div>
                <div className="orders-overview__task">
                    <p>Costs (incl. VAT): {task.costtotalincludingvat}</p>
                    <p>Date: {moment(reftime).format('DD.MM.YYYY')}</p>
                    <p>Pickup: {moment(reftime).format('HH:mm')} - {moment(reftime).add(task.pickup_handlingtime,'minutes').format('HH:mm')}</p>
                    <p>ETA: {moment(reftime).add(task.pickup_handlingtime + task.pickup_traveltime + task.delivery_traveltime ,'minutes').format('HH:mm')}</p>
                </div>
            </div>
        );
    }
}


export default OrdersOverview;
