'use strict';

var React = require('react');
var ProductList = require('./ProductList');
var CheckoutButton = require('./CheckoutButton');
var TreePath = require('./TreePath');
var SearchForm = require('./SearchForm');
var WebApi = require('../WebApi');
WebApi.getAllProducts();

var CatalogPage = React.createClass({displayName: "CatalogPage",

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="pull-right">
                            <CheckoutButton/>
                        </div>
                        <div className="pull-left">
                            <TreePath/>
                        </div>
                        <div className="pull-left">
                            <SearchForm/>
                        </div>
                    </div>
                </div>
                <ProductList/>
            </div>
        );
    }
});

module.exports = CatalogPage;
