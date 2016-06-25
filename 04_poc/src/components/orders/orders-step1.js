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

    verifyAddress() {
        if(!this.state.streetAddress.auto || !this.state.streetAddress.auto.getPlace()) {
            this.setInlineError('streetAddress','not a valid address');
            return;
        }
        const address = getAddressFromGoogleMapAutoComplete(this.state.streetAddress.auto.getPlace(),document.getElementById('street_address'));
        let customernumber = '';
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
                console.log(json);
                this.setInlineError('streetAddress',json.message)
                if(json.valid) {
                    const getTrainStation = {
                        'method': 'POST',
                        'headers': {'Content-Type': 'application/json'},
                        'body': JSON.stringify({
                            address: address
                        })
                    };
                    console.log(getTrainStation);
                    return(fetch('/api/v1/getTrainStation',getTrainStation));
                }
            })
            .then(data => data.json())
            .then(json => {
                customernumber = json.customernumber;
                const stop = {
                    'method': 'POST',
                    'headers': {'Content-Type': 'application/json'},
                    'body': JSON.stringify({
                        type: 'address',
                        params: Object.assign({},{tasktoken:this.props.orders.taskToken},address)
                    })
                };

                return fetch('/api/v1/addStop',stop);
            })
            .then(data => data.json())
            .then(json => {
                if(json.statuscode < 1) {
                    console.error(json);
                    throw 'Could not add stop';
                }
                const stop = {
                    'method': 'POST',
                    'headers': {'Content-Type': 'application/json'},
                    'body': JSON.stringify({
                        type: 'customer',
                        params: Object.assign({},{tasktoken:this.props.orders.taskToken},{customernumber:customernumber})
                    })
                };
                return fetch('/api/v1/addStop',stop);
            })
            .then(data => data.json())
            .then(json => {
                if(json.statuscode < 1) {
                    console.error(json);
                    throw 'Could not add stop';
                }
                const stopList = {
                    'method': 'POST',
                    'headers': {'Content-Type': 'application/json'},
                    'body': JSON.stringify({
                        tasktoken: this.props.orders.taskToken
                    })
                };
                return fetch('/api/v1/getStopList',stopList);
            })
            .then(data => data.json())
            .then(json => {
                console.log(json);
            })
            .catch(error => {
                console.error(error);
            });
    }
    
    addAddressesAndContinue() {
        //TODO: execute only if no error
        
        
    }

    setInlineError(field,message) {
        let newState = Object.assign({},this.state);
        newState[field].error = message;
        this.setState(newState);
    }

    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="orders-step1">
                <h1>Step 1</h1>
                <form ref="step1Form" className="orders-step1__form" onSubmit={this.handleSubmit}>
                    <TextField id="street_address" ref="street_address" fullWidth={true} onBlur={this.verifyAddress.bind(this)} errorText={this.state.streetAddress.error} />
                    <br />
                    <RaisedButton label="Primary" primary={true}  />
                </form>
            </div>
        );
    }
}


export default withRouter(OrdersStep1);
