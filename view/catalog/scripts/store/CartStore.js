/**
 * Created by steve on 12/04/15.
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../Dispatcher');
var CartConstants = require('../Constant');
var _ = require('lodash');

var ActionTypes = CartConstants;
var CHANGE_EVENT = 'change';

var _cartItems = [];
var _isOpen = false;

function _add(product) {
    _cartItems.push(product);
}

function _getItemBySku(sku) {
    return _.find(_cartItems, item =>
        item.sku === sku
    );
}

function _setQty(qty, sku) {
    _getItemBySku(sku).qty = qty;
}

function _remove(sku) {
    _cartItems =  _.reject(_cartItems, item =>
        item.sku === sku
    );
}

function _create(product) {
    var i = product.variantIndex;
    var newItem = _.assign({}, product, product.variants[i]);
    newItem.qty = 1;
    newItem.initialInventory = product.variants[i].inventory;
    return newItem;
}

function _toggleCart() {
    _isOpen = !_isOpen;
}

class CartStore extends EventEmitter {

    constructor() {
        super();
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    getAll() {
        return _cartItems;
    }

    getCartItemsCount() {
        return _.reduce(_cartItems, function(count, item) {
            return (count = count + Number(item.qty));
        }, 0);
    }

    getCartTotal() {
        return _.reduce(_cartItems, function(total, item) {
            total = total + Number(item.price * item.qty);
            total.toFixed(2);
            return total;
        }, 0);
    }

    getCartStatus() {
        return _isOpen;
    }

}

var cartStore = new CartStore();

CartStore.DispactToken = Dispatcher.register(function(action) {

    switch(action.type) {
        case ActionTypes.ADD_PRODUCT_TO_CART:
            var product = action.product;
            var i = product.variantIndex;
            var cartItem = _getItemBySku(product.variants[i].sku);
            if(!cartItem) {
                var newItem = _create(action.product);
                _add(newItem);
            }else {
                cartItem.qty += 1;
            }
            cartStore.emitChange();
            break;

        case ActionTypes.SET_QTY:
            _setQty(action.qty, action.sku);
            cartStore.emitChange();
            break;

        case ActionTypes.REMOVE_CART_ITEM:
            _remove(action.sku);
            cartStore.emitChange();
            break;

        case ActionTypes.TOGGLE_CART:
            _toggleCart();
            cartStore.emitChange();
            break;

        default:
            return true;
    }

    return true;

});

module.exports = cartStore;
