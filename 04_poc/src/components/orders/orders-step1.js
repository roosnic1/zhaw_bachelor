import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';

//import { ordersActions } from 'src/core/orders';


class OrdersStep1 extends Component {
    static propTypes = {

    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            auto1: null,
            auto2: null
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
        let input = document.getElementById('start');
        let auto1 = new google.maps.places.Autocomplete(input, options);
        this.setState({
            auto1: auto1
        });
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    render() {
        const {
            orders
        } = this.props;

        return (
            <div className="orders-step1">
                <h1>Step 1</h1>
                <form ref="step1Form" className="orders-step1__form" onSubmit={this.handleSubmit}>
                    <input id="start" type="text" ref="start" placeholder="Start address" />
                    <input type="text" ref="end" placeholder="End address" />
                    <input type="submit" hidden />
                </form>
            </div>
        );
    }
}


export default withRouter(OrdersStep1);
