import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'
import { TextField, RaisedButton } from 'material-ui';

//import { ordersActions } from 'src/core/orders';
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers'


class OrdersStep1 extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            streetAddress: {
                auto: null,
                error: ''
            }
        };
    }

    componentWillMount() {
        console.log(this.props.orders.taskToken);
        if(this.props.orders.taskToken === null) {
            this.props.router.push('/orders');
        }
    }

    componentDidMount() {
        const options =  {
            types: ['address']
        }
        const streetAddress = document.getElementById('street_address');
        let autoComplete = new google.maps.places.Autocomplete(streetAddress, options);
        this.setState({
            streetAddress: {
                auto: autoComplete
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    addAddress() {
        if(!this.state.streetAddress.auto || !this.state.streetAddress.auto.getPlace()) {
            this.setInlineError('streetAddress','not a valid address');
            return;
        }
        const address = getAddressFromGoogleMapAutoComplete(this.state.streetAddress.auto.getPlace(),document.getElementById('street_address'));
        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({
                ids: {
                    productid: this.props.orders.productList[0].productid,
                    paymentid: this.props.orders.paymentList[0].paymentid
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

    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="orders-step1">
                <h1>Step 1</h1>
                { this.renderStopList() }
                <form ref="step1Form" className="orders-step1__form" onSubmit={this.handleSubmit}>
                    <TextField id="street_address" ref="street_address" fullWidth={true} onBlur={this.addAddress.bind(this)} errorText={this.state.streetAddress.error} />
                    <br />
                    <RaisedButton label="Primary" primary={true}  />
                </form>
            </div>
        );
    }
}


export default withRouter(OrdersStep1);
