import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { RaisedButton, TextField } from 'material-ui';

// import { ordersActions } from 'src/core/orders';

const textFieldStyle = {
  display: 'block'
};

class OrdersStep4 extends Component {
  static propTypes = {
    orderTask: PropTypes.func.isRequired,
    orders: PropTypes.object,
    updateTaskinfo: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.fields = [];
  }

  componentDidMount() {
    // Set current step
    localStorage.setItem('currentStep', 'step4');
  }

  saveTaskInfo() {
    //TODO: implement once Backend is ready
    /*const infos = this.fields.reduce((prev, curr) => {
      if (curr !== null) {
        prev += ' /////// ' + curr.input.value;
      }
      return prev;
    }, '');
    console.log(infos);
    this.props.updateTaskinfo(this.props.tasktoken, infos);*/
  }


  orderTask() {
    this.props.orderTask(this.props.orders.tasktoken)
      .then(() => {
        // Continue to last step
        this.props.router.push('/orders/step5');
      });
  }

  renderOrderPackageInfos() {
    //const { orders } = this.props;

    return (
      <div>
        <TextField
          id="dimensions"
          ref={r => this.fields.push(r)}
          floatingLabelText="Packet Dimensions"
          floatingLabelFixed={true}
          style={textFieldStyle}
          onBlur={this.saveTaskInfo.bind(this)}
        />
        <TextField
          id="costums"
          ref={r => this.fields.push(r)}
          floatingLabelText="Custom Informations"
          floatingLabelFixed={true}
          style={textFieldStyle}
          onBlur={this.saveTaskInfo.bind(this)}
        />
      </div>
    );
  }

  render() {

    return (
      <div className="orders-step4">
        {this.renderOrderPackageInfos()}
        <RaisedButton label="Order Task" primary={true} onClick={this.orderTask.bind(this)} />
      </div>
    );
  }
}


export default withRouter(OrdersStep4);
