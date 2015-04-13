/**
 * Created by steve on 12/04/15.
 */
'use strict';

var Dispatcher = require('../Dispatcher');
var Constant = require('../Constant');

var ActionTypes = Constant;

var CartActions = {

    addToCart: function(product) {
        Dispatcher.dispatch({
            type: ActionTypes.ADD_PRODUCT_TO_CART,
            product: product
        });
    },

    setQty: function(qty, sku) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_QTY,
            qty: qty,
            sku: sku
        });
    },

    remove: function(sku) {
        Dispatcher.dispatch({
            type: ActionTypes.REMOVE_CART_ITEM,
            sku: sku
        });
    },

    toggleCart: function(isOpen) {
        Dispatcher.dispatch({
            type: ActionTypes.TOGGLE_CART
        });
    }

};

module.exports = CartActions;
