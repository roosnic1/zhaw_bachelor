/* global google */
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { TextField, RaisedButton } from 'material-ui';
import { getAddressFromGoogleMapAutoComplete } from 'src/core/orders/helpers';



class OrdersStep1 extends Component {
  static propTypes = {
    addStop: PropTypes.func.isRequired,
    compileTask: PropTypes.func.isRequired,
    orders: PropTypes.object,
    router: PropTypes.object
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
        // Set current step
    localStorage.setItem('currentStep', 'step1');

    this.initGoogleAutocomplete();
  }

  initGoogleAutocomplete() {
        // TODO: check for google lib
    if (!window.google) {
      setTimeout(() => {
        this.initGoogleAutocomplete();
      }, 200);
      return;
    }
    const options = { types: ['address'] };
    const streetAddress = document.getElementById('street_address');
    let autoComplete = new google.maps.places.Autocomplete(streetAddress, options);
    //autoComplete.addListener('place_changed', this.addAddress.bind(this));
    this.setState(Object.assign({}, this.state, {
      streetAddress: {
        auto: autoComplete
      }
    }));
  }

  addAddress() {
    if (!this.state.streetAddress.auto || !this.state.streetAddress.auto.getPlace()) {
      this.setInlineError('streetAddress', 'not a valid address');
      return;
    }
    const address = getAddressFromGoogleMapAutoComplete(this.state.streetAddress.auto.getPlace(), document.getElementById('street_address'));
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
    fetch('/api/v1/verifyaddress', opt)
            .then(data => data.json())
            .then(json => {
              this.setInlineError('streetAddress', json.message);
              if (json.valid) {
                return this.props.addStop(tasktoken, address);
              }
            })
            .then(() => {
              if (this.props.orders.stops.length === 1) {
                const input = document.getElementById('street_address');
                input.value = '';
                input.focus();
              }
            })
            .catch(error => {
              console.error(error);
            });
  }

  setInlineError(field, message) {
    let newState = Object.assign({}, this.state);
    newState[field].error = message;
    this.setState(newState);
  }

  compileTask() {
    this.props.compileTask(this.props.orders.tasktoken)
      .then(() => { this.props.router.push('/orders/step2'); });
  }

  renderInputField() {
    const { orders } = this.props;
    const style = {
      width: 450
    };
    return (
      <div>
        <TextField
          id="street_address"
          floatingLabelText={orders.stops.length > 0 ? 'End address' : 'Start address' }
          floatingLabelFixed={true}
          style={style}
          errorText={this.state.streetAddress.error} />
        <RaisedButton label={orders.stops.length > 0 ? 'Add End' : 'Add Start' } primary={true}  onClick={this.addAddress.bind(this)} />
      </div>
    )
  }

  render() {
    const { orders } = this.props;
    return (
      <div className="orders-step1">
        {orders.stops.length < 2 ? this.renderInputField() : <RaisedButton label="Next" primary={true} onClick={this.compileTask.bind(this)} />}
      </div>
    );
  }
}


export default withRouter(OrdersStep1);
