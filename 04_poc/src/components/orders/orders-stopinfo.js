import React, { Component, PropTypes } from 'react';
import { TextField } from 'material-ui';


const textFieldStyle = {
  display: 'block'
};


class OrdersStopinfo extends Component {
  static propTypes = {
    stop: PropTypes.object.isRequired,
    tasktoken: PropTypes.string.isRequired,
    updateStopinfo: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.fields = [];
  }

  saveStopInfo() {
    const infos = this.fields.reduce((prev, curr) => {
      if (curr !== null) {
        prev[curr.input.id] = curr.input.value;
      }
      return prev;
    }, {});
    this.props.updateStopinfo(this.props.tasktoken, this.props.stop.id, infos);
  }

  render() {
    const { stop } = this.props;

    return (
      <div className="orders-stopinfo">
        <h2>Stop Information</h2>
        <div className="orders-stopinfo__header">
          <p>{stop.street} {stop.housenumber}, {stop.city} {stop.zip}, {stop.isocode}</p>
        </div>
        <div className="orders-overview__infofields">
          <TextField
            id="notepublic"
            ref={r => this.fields.push(r)}
            floatingLabelText="Public Note"
            floatingLabelFixed={true}
            style={textFieldStyle}
            value={stop.notepublic}
            onBlur={this.saveStopInfo.bind(this)}
          />
          <TextField
            id="noteinhouse"
            ref={r => this.fields.push(r)}
            floatingLabelText="Inhouse Note"
            floatingLabelFixed={true}
            style={textFieldStyle}
            value={stop.noteinhouse}
            onBlur={this.saveStopInfo.bind(this)}
          />
          <TextField
            id="noteprivate"
            ref={r => this.fields.push(r)}
            floatingLabelText="Private Note"
            floatingLabelFixed={true}
            style={textFieldStyle}
            value={stop.noteprivate}
            onBlur={this.saveStopInfo.bind(this)}
          />
          <TextField
            id="contactperson"
            ref={r => this.fields.push(r)}
            floatingLabelText="Contact Person"
            floatingLabelFixed={true}
            style={textFieldStyle}
            value={stop.contactperson}
            onBlur={this.saveStopInfo.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default OrdersStopinfo;
