import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'
import { TextField, RaisedButton, SelectField, MenuItem } from 'material-ui';
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers'



class OrdersStart extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            streetAddress: {
                auto: null,
                error: ''
            },
            productid: "13",
            paymentid: "1"

        };
        //this.props.orders.productList[0].productId
    }


    componentDidMount() {
        this.initGoogleAutocomplete();
    }

    initGoogleAutocomplete() {
        // TODO: check for google lib
        const options =  {
            types: ['address']
        }
        const streetAddress = document.getElementById('street_address');
        let autoComplete = new google.maps.places.Autocomplete(streetAddress, options);
        this.setState(Object.assign({},this.state,{
            streetAddress: {
                auto: autoComplete
            }
        }));
    }

    addAddress() {
        if(!this.state.streetAddress.auto || !this.state.streetAddress.auto.getPlace()) {
            this.setInlineError('streetAddress','not a valid address');
            return;
        }
        const address = getAddressFromGoogleMapAutoComplete(this.state.streetAddress.auto.getPlace(),document.getElementById('street_address'));
        const { productid, paymentid } = this.state;
        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({
                ids: {
                    productid,
                    paymentid
                },
                address: address
            })
        };
        fetch('/api/v1/verifyaddress',opt)
            .then(data => data.json())
            .then(json => {
                this.setInlineError('streetAddress',json.message)
                if(json.valid) {
                    if(!this.props.orders.startStopsAdded) {
                        return this.props.addStartAddress(this.props.orders.taskToken,address);
                    } else {
                        return this.props.addEndAddress(this.props.orders.taskToken,address);
                    }

                }
            })
            .then(() => {
                console.log('Job should be done',this.props.orders.startStopsAdded);
                if(this.props.orders.startStopsAdded || this.props.orders.endStopsAdded) {
                    const input = document.getElementById('street_address');
                    input.value = '';
                    input.focus();
                }


            })
            .catch(error => {
                console.error(error);
            });
    }

    setInlineError(field,message) {
        let newState = Object.assign({},this.state);
        newState[field].error = message;
        this.setState(newState);
    }

    handleProductChange(event, index, productid) {
        this.setState(Object.assign({},this.state,{productid}))
    }

    handlePaymentChange(event,index,paymentid) {
        this.setState(Object.assign({},this.state,{paymentid}))
    }

    renderStopList() {
        if(this.props.orders.stops.length > 0) {
            return (
                <div className="stops-wrapper">
                    {this.props.orders.stops.map(stop => <p>{stop.street} {stop.housenumber}, {stop.city} {stop.zip}, {stop.isocode}</p>)}
                </div>
            )
        } else {
            return (
                <div className="stops-wrapper">
                    <p>No Stops yet</p>
                </div>
            )
        }
    }

    renderProductSelect() {
        return (
            <SelectField value={this.state.productid} autoWidth={true} onChange={this.handleProductChange.bind(this)}>
                {this.props.orders.productList.map(product => <MenuItem value={product.productid} primaryText={product.alias} />)}
            </SelectField>
        )
    }

    renderPaymentSelect() {
        return (
            <SelectField value={this.state.paymentid} autoWidth={true} onChange={this.handlePaymentChange.bind(this)}>
                {this.props.orders.paymentList.map(payment => <MenuItem value={payment.paymentid} primaryText={payment.alias} />)}
            </SelectField>
        )
    }


    render() {

        return (
            <div className="orders-step1">
                <h1>Start your Order</h1>
                <p>Product</p>
                { this.renderProductSelect() }

                <p>Payment</p>
                { this.renderPaymentSelect() }

                <h2>Stops</h2>
                { this.renderStopList() }

                <h2>Input</h2>
                <form ref="step1Form" className="orders-step1__form" onSubmit={(e) => {e.preventDefault();}}>
                    <TextField id="street_address" ref="street_address" fullWidth={true} onBlur={this.addAddress.bind(this)} errorText={this.state.streetAddress.error} />
                    <br />
                    <RaisedButton label="Primary" primary={true}  />
                </form>
            </div>
        );
    }
}

OrdersStart.contextTypes = {
    readyForTask: PropTypes.bool
}

export default withRouter(OrdersStart);
