/**
 * Created by steve on 12/04/15.
 */
'use strict';

var Dispatcher = require('../Dispatcher');
var Constant = require('../Constant');

var ActionTypes = Constant;

var ProductActionCreators = {

    setProductVariant: function(variant) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_PRODUCT_VARIANT,
            productId: variant.productId,
            variantIndex: variant.variantIndex
        });
    },

    removeOneFromInventory: function(product) {
        Dispatcher.dispatch({
            type: ActionTypes.REMOVE_ONE_FROM_INVENTORY,
            product: product
        });
    },

    setInventory: function (id, initialInventory, qty) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_PRODUCT_INVENTORY,
            id: id,
            initialInventory: initialInventory,
            qty: qty
        });
    }

};

module.exports = ProductActionCreators;
