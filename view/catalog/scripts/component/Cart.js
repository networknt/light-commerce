/**
 * Created by steve on 12/04/15.
 */
'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;
var CartItem = require('./CartItem');
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

var Cart = React.createClass({

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

        var cartItems = this.state.cartItems.map(
            (cartItem, index) =>
                <CartItem cartItem={cartItem} key={index} />
        );

        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems}
                    <tr>
                        <td></td>
                        <td>Total</td>
                        <td className="text-right">
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    },

    _onChange: function() {
        this.setState(getStateFromStores());
    },

    _toggleCart: function (e) {
        e.preventDefault();
        CartActionCreator.toggleCart();
    }

})

module.exports = Cart
