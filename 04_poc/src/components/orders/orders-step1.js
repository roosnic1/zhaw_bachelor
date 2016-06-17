import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'
import TextField from 'material-ui/TextField';

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
        let input1 = document.getElementById('start');
        let auto1 = new google.maps.places.Autocomplete(input1, options);
        let input2 = document.getElementById('end');
        let auto2 = new google.maps.places.Autocomplete(input2, options);
        this.setState({
            auto1,
            auto2
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
                    <TextField id="start" ref="start"  />
                    <TextField id="end" ref="end"  />
                    <input type="submit" hidden />
                </form>
            </div>
        );
    }
}


export default withRouter(OrdersStep1);
