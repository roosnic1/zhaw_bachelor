import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'
import { RaisedButton, SelectField, MenuItem, DatePicker, TimePicker } from 'material-ui';




class OrdersStart extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            productid: "6",
            paymentid: "1",
            date: new Date(),
            time: new Date()
        };
        //this.props.orders.productList[0].productId
    }
    

    handleProductChange(event, index, productid) {
        this.setState(Object.assign({},this.state,{productid}))
    }

    handlePaymentChange(event,index,paymentid) {
        this.setState(Object.assign({},this.state,{paymentid}))
    }

    handleDateChange(event,date) {
        this.setState(Object.assign({},this.state,{date}));
    }

    handleTimeChange(event,time) {
        this.setState(Object.assign({},this.state,{time}));
    }

    createTask() {
        const { date, time } = this.state;
        let datetime = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
            time.getHours(), time.getMinutes(), time.getSeconds());

        this.props.createTask(this.state.productid,this.state.paymentid,datetime.getTime() / 1000).then(() => { this.props.router.push('/orders/step1'); });
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
            <div className="orders-start">
                <h1>Start your Order</h1>
                <p>Product</p>
                { this.renderProductSelect() }

                <p>Payment</p>
                { this.renderPaymentSelect() }
                <br />

                <p>Date/Time</p>
                <DatePicker hintText="Date" value={ this.state.date } onChange={ this.handleDateChange.bind(this) } />
                <TimePicker hintText="Time" format="24hr" value={ this.state.time } onChange={ this.handleTimeChange.bind(this) } />

                <RaisedButton label="Create Task" primary={true} onClick={this.createTask.bind(this)}  />
            </div>
        );
    }
}

OrdersStart.contextTypes = {
    readyForTask: PropTypes.bool
}

export default withRouter(OrdersStart);
