import React, { Component, PropTypes } from 'react';
import { TextField, RaisedButton } from 'material-ui'
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers';
import moment from 'moment';


//import { ordersActions } from 'src/core/orders';


class OrdersStopinfo extends Component {
    static propTypes = {
        stop: PropTypes.object.isRequired
    };


    saveStopInfo() {

    }

    render() {
        const {
            stop
        } = this.props;

        return (
            <div className="orders-stopinfo">
                <div className="orders-stopinfo__header">
                    <p>{stop.street} {stop.housenumber}, {stop.city} {stop.zip}, {stop.isocode}</p>
                </div>
                <div className="orders-overview__infofields">
                    <form ref="infoform" onSubmit={(e) => {e.preventDefault();}}>
                        <TextField ref="notepublic" fullWidth={true} value={ stop.notepublic } onBlur={ this.saveStopInfo.bind(this) } />
                        <TextField ref="noteinhouse" fullWidth={true} value={ stop.noteinhouse } onBlur={ this.saveStopInfo.bind(this) } />
                        <TextField ref="noteprivate" fullWidth={true} value={ stop.noteprivate } onBlur={ this.saveStopInfo.bind(this) } />
                        <TextField ref="contactperson" fullWidth={true} value={ stop.contactperson } onBlur={ this.saveStopInfo.bind(this) } />
                    </form>
                </div>
            </div>
        );
    }
}


export default OrdersStopinfo;
