/**
 * Created by steve on 12/04/15.
 */
var React = require('react')
var Modal = require('react-bootstrap').Modal
var CheckoutCart = require('./CheckoutCart')
var CheckoutDone = require('./CheckoutDone')
var CartStore = require('../store/CartStore');
var CartActionCreator = require('../action/CartActionCreator');

function getStateFromStores() {
    return {
        cartItems: CartStore.getAll(),
        cartItemsCount: CartStore.getCartItemsCount(),
        cartTotal: CartStore.getCartTotal(),
        isOpen: CartStore.getCartStatus()
    };
}


var CheckoutModal = React.createClass({

    propTypes: {
        cartItems: React.PropTypes.array,
        cartItemsCount: React.PropTypes.number,
        cartTotal: React.PropTypes.number,
        isOpen: React.PropTypes.bool
    },

    getInitialState: () => getStateFromStores(),

    componentDidMount: function() {
        CartStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        CartStore.removeChangeListener(this._onChange);
    },

    render: function() {

        var contents = <CheckoutCart
            products={this.state.cartItems}
            onCheckout={this.onCheckout}
            totalPrice={ this.state.cartTotal.toFixed(2) }
             />

        return <Modal {...this.props} title="Cart">{ contents }</Modal>;

    },

    _onChange: function() {
        this.setState(getStateFromStores());
    },

    _toggleCart: function (e) {
        e.preventDefault();
        CartActionCreator.toggleCart();
    }

})

module.exports = CheckoutModal
