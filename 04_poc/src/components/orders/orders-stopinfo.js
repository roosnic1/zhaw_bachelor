import React, { Component, PropTypes } from 'react';
import { TextField, RaisedButton } from 'material-ui'
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers';
import moment from 'moment';


//import { ordersActions } from 'src/core/orders';
const textFieldStyle = {
    display: 'block'
};


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
                <h2>Stop Information</h2>
                <div className="orders-stopinfo__header">
                    <p>{stop.street} {stop.housenumber}, {stop.city} {stop.zip}, {stop.isocode}</p>
                </div>
                <div className="orders-overview__infofields">
                    <TextField id="notepublic"
                               ref="notepublic"
                               floatingLabelText="Public Note"
                               floatingLabelFixed={true}
                               style={ textFieldStyle }
                               value={ stop.notepublic }
                               onBlur={ this.saveStopInfo.bind(this) } />
                    <TextField id="noteinhouse"
                               ref="noteinhouse"
                               floatingLabelText="Inhouse Note"
                               floatingLabelFixed={true}
                               style={ textFieldStyle }
                               value={ stop.noteinhouse }
                               onBlur={ this.saveStopInfo.bind(this) } />
                    <TextField id="noteinprivate"
                               ref="noteprivate"
                               floatingLabelText="Private Note"
                               floatingLabelFixed={true}
                               style={ textFieldStyle }
                               value={ stop.noteprivate }
                               onBlur={ this.saveStopInfo.bind(this) } />
                    <TextField id="contactperson"
                               ref="contactperson"
                               floatingLabelText="Contact Person"
                               floatingLabelFixed={true}
                               style={ textFieldStyle }
                               value={ stop.contactperson }
                               onBlur={ this.saveStopInfo.bind(this) } />
                </div>
            </div>
        );
    }
}




export default OrdersStopinfo;
