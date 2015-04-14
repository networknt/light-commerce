/**
 * Created by steve on 12/04/15.
 */
'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;
var CartItem = require('./CartItem');
var CartStore = require('../store/CartStore');
var CartActionCreator = require('../action/CartActionCreator');

var Cart = React.createClass({


    render: function() {

        var cartItems = this.props.products.map(function(product) {
            return <CartItem key={product.id} product={product} />
        });

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
                            <strong>{ this.props.totalPrice }</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

})

module.exports = Cart
