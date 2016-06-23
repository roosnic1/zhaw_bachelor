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
            start: {
                auto: null,
                error: ''
            },
            end: {
                auto: null,
                error:''
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
        let input1 = document.getElementById('start');
        let start = new google.maps.places.Autocomplete(input1, options);
        let input2 = document.getElementById('end');
        let end = new google.maps.places.Autocomplete(input2, options);
        this.setState({
            start: {
                auto: start
            },
            end: {
                auto: end
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    verifyAddress(input) {
        if(!this.state[input].auto || !this.state[input].auto.getPlace()) {
            this.setInlineError(input,'not a valid address');
            return;
        }
        const address = getAddressFromGoogleMapAutoComplete(this.state[input].auto.getPlace(),document.getElementById(input));

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
        console.log(opt);
        fetch('/api/v1/verifyaddress',opt)
            .then(data => data.json())
            .then(json => {
                console.log(json);
                switch(json.statuscode) {
                    case -2:
                    case 1:
                        this.setInlineError(input,'');
                        break;
                    case -3:
                        this.setInlineError(input,'not covered by supply area');
                        break;
                    default:
                        this.setInlineError(input,'not a valid address');
                }
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
                    <TextField id="start" ref="start" fullWidth={true} onBlur={this.verifyAddress.bind(this,'start')} errorText={this.state.start.error} />
                    <br />
                    <TextField id="end" ref="end" fullWidth={true} onBlur={this.verifyAddress.bind(this,'end')} errorText={this.state.end.error} />
                    <br />
                    <RaisedButton label="Primary" primary={true}  />
                </form>
            </div>
        );
    }
}


export default withRouter(OrdersStep1);
