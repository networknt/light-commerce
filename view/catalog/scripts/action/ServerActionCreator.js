/**
 * Created by steve on 12/04/15.
 */
'use strict';

var Dispatcher = require('../Dispatcher');
var Constant = require('../Constant');

module.exports = {
    receiveAll: function(products) {
        Dispatcher.dispatch({
            type: Constant.RECEIVE_ALL_PRODUCTS,
            products: products
        });
    }
};
