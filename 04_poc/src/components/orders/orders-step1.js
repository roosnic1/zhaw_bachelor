import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'
import { TextField, RaisedButton } from 'material-ui';

//import { ordersActions } from 'src/core/orders';


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
        //let input = this.refs.step1Form.start;
        /*let input1 = document.getElementById('start');
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
        });*/
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    verifyAddress(input) {
        return;
        //console.log(this.state);
        if(!this.state[input].auto || !this.state[input].auto.getPlace()) {
            this.setInlineError(input,'not a valid address');
            return;
        }

        let adr = this.state[input].auto.getPlace();
        console.log(adr);
        const address = {};
        adr.address_components.map((comp) => {
            switch(comp.types[0]) {
                case 'street_number':
                    address['housenumber'] = comp.long_name;
                    break;
                case 'route':
                    address['street'] = comp.long_name;
                    break;
                case 'postal_code':
                    address['zip'] = comp.long_name;
                    break;
                case 'country':
                    switch(comp.short_name) {
                        case 'DE':
                            address['isocode'] = 'DEU';
                            break;
                        case 'CH':
                            address['isocode'] = 'CHE';
                            break;
                        case 'AT':
                            address['isocode'] = 'AUT';
                            break;
                    }
                    break;
            }
        });

        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify(Object.assign({tasktoken: this.props.orders.taskToken},address))
        };
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

    setInlineError(field,message) {
        let newState = Object.assign({},this.state);
        newState[field].error = message;
        this.setState(newState);
    }

    autoCompleteInput(input) {
        console.log(this.refs[input].input.value);

        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({querystring: this.refs[input].input.value})
        };

        fetch('/api/v1/autocompletestreet',opt)
            .then((data) => data.json())
            .then((json) => {
                console.log(json);
            });
    }

    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="orders-step1">
                <h1>Step 1</h1>
                <form ref="step1Form" className="orders-step1__form" onSubmit={this.handleSubmit}>
                    <TextField id="start" ref="start" fullWidth={true} onChange={this.autoCompleteInput.bind(this,'start')} onBlur={this.verifyAddress.bind(this,'start')} errorText={this.state.start.error} />
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
