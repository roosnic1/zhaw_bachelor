import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { TextField, RaisedButton } from 'material-ui'
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers';


//import { ordersActions } from 'src/core/orders';


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

    componentDidMount() {
        this.initGoogleAutocomplete();
    }

    initGoogleAutocomplete() {
        // TODO: check for google lib
        if(!window.google) {
            setTimeout(() => {
                this.initGoogleAutocomplete();
            },200);
            return;
        }
        const options =  { types: ['address'] };
        const streetAddress = document.getElementById('street_address');
        let autoComplete = new google.maps.places.Autocomplete(streetAddress, options);
        autoComplete.addListener('place_changed',this.addAddress.bind(this));
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
        const { productid, paymentid, tasktoken } = this.props.orders;
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
                        return this.props.addStartAddress(tasktoken,address);
                    } else {
                        return this.props.addEndAddress(tasktoken,address);
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

    calculateTask() {
        this.props.calculateTask(this.props.orders.tasktoken)
            .then(() => { this.props.router.push('/orders/step2') });
    }

    renderStopList() {
        if(this.props.orders.stops.length > 0) {
            return (
                <div className="stops-wrapper">
                    {this.props.orders.stops.map(stop => {
                        if(stop.alias) {
                            return <p>{stop.alias}</p>;
                        } else {
                            return <p>{stop.street} {stop.housenumber}, {stop.city} {stop.zip}, {stop.isocode}</p>;
                        }
                    })}
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
            <div className="orders-start">
                <h2>Stops</h2>
                { this.renderStopList() }

                <h2>Input</h2>
                <form ref="step1Form" className="orders-step1__form" onSubmit={(e) => {e.preventDefault();}}>
                    <TextField id="street_address" ref="street_address" fullWidth={true} errorText={this.state.streetAddress.error} />
                    <br />
                    <RaisedButton label="Primary" primary={true}  onClick={this.calculateTask.bind(this)}/>
                </form>
            </div>
        );
    }
}


export default withRouter(OrdersStep1);
