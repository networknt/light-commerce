/**
 * Created by steve on 12/04/15.
 */
'use strict';

var keyMirror = require('keymirror');

module.exports =  keyMirror({
    RECEIVE_ALL_PRODUCTS: null, // load mock products
    ADD_PRODUCT_TO_CART: null,
    SET_PRODUCT_VARIANT: null, // set product variation
    SET_QTY: null,
    REMOVE_CART_ITEM: null,
    SET_PRODUCT_INVENTORY: null,
    REMOVE_ONE_FROM_INVENTORY: null,
    TOGGLE_CART: null // Open/close cart
});
