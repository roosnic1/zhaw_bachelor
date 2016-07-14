import React, { Component, PropTypes } from 'react';
import { TextField, IconButton } from 'material-ui';
import Delete from 'material-ui/svg-icons/action/delete';



class OrdersAddstop extends Component {
  static propTypes = {
    stop: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.fields = [];
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
    const streetAddress = document.getElementById('addstop' + this.props.pos);
    let autoComplete = new google.maps.places.Autocomplete(streetAddress, options);
    autoComplete.addListener('place_changed', this.addAddress.bind(this));
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
          //return this.props.addStop(tasktoken, address);
          console.log(json);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { stop } = this.props;
    const textFieldstyle = {visibility: stop !== undefined ? 'hidden' : 'visible'}

    return (
      <div className="orders-addstop">
          <div className="address">
            {stop !== undefined ? stop.street + ' ' + stop.housenumber + ', ' + stop.city + ' ' + stop.zip + ', ' + stop.isocode : ''}
            <IconButton tooltip="bottom-right" touch={true} tooltipPosition="bottom-right">
              <Delete />
            </IconButton>
          </div>
          <TextField
            style={textFieldstyle}
            id={'addstop' + this.props.pos}
            ref={r => this.fields.push(r)}
            floatingLabelText={this.props.pos}
            floatingLabelFixed={true}
          />
      </div>
    );
  }
}

export default OrdersAddstop;
