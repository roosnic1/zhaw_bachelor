import React, { Component, PropTypes } from 'react';
import { TextField, RaisedButton } from 'material-ui'
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers';
import moment from 'moment';


//import { ordersActions } from 'src/core/orders';


class OrdersStopinfo extends Component {
    static propTypes = {
        stop: PropTypes.object.isRequired
    };

    componentDidMount() {
        console.log(this.props.stop);
    }


    saveStopInfo() {
        let infos = Object.keys(this.refs).reduce((prev,curr) => {
            prev[curr] = this.refs[curr].input.value;
            return prev;
        }, {});
        this.props.updateStopinfo(this.props.tasktoken,this.props.stop.id,infos)
            .then(() => console.log('updated stop info'));
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
                    <TextField id="notepublic" ref="notepublic" fullWidth={true} value={ stop.notepublic } onBlur={ this.saveStopInfo.bind(this) } />
                    <TextField id="noteinhouse" ref="noteinhouse" fullWidth={true} value={ stop.noteinhouse } onBlur={ this.saveStopInfo.bind(this) } />
                    <TextField id="noteinprivate" ref="noteprivate" fullWidth={true} value={ stop.noteprivate } onBlur={ this.saveStopInfo.bind(this) } />
                    <TextField id="contactperson" ref="contactperson" fullWidth={true} value={ stop.contactperson } onBlur={ this.saveStopInfo.bind(this) } />
                </div>
            </div>
        );
    }
}


export default OrdersStopinfo;
