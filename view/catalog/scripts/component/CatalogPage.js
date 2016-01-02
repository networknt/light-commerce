'use strict';

var React = require('react');
var ProductList = require('./ProductList');
var CheckoutButton = require('./CheckoutButton');
var TreePath = require('./TreePath');
var SearchForm = require('./SearchForm');
var WebApi = require('../WebApi');
var ReactPaginate = require('react-paginate');
var $ = require('jquery');

WebApi.getAllProducts();

var CatalogPage = React.createClass({displayName: "CatalogPage",

    loadCatalogFromServer: function() {
        $.ajax({
            url      : this.props.url,
            data     : {cmd: "{\"readOnly\": true, \"category\":\"catalog\",\"name\":\"getCatalogProduct\", \"data\": {\"host\":\"example\",\"categoryId\":\"computer\",\"pageSize\":" + this.props.perPage +",\"pageNo\": " + this.state.offset + "}}"},
            //data: {cmd: this.props.perPage},
            dataType : 'json',
            type     : 'GET',

            success: function(data) {
                this.setState({data: data.comments, pageNum: Math.ceil(data.meta.total_count / data.meta.limit)});
            }.bind(this),

            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handlePageClick: function(data) {
        var selected = data.selected;
        var offset = Math.ceil(selected * this.props.perPage);

        this.setState({offset: offset}, function() {
            this.loadCatalogFromServer();
        }.bind(this));

        this.loadCatalogFromServer();
    },

    getInitialState: function() {
        return {data: [], offset: 0};
    },

    componentDidMount: function() {
        this.loadCatalogFromServer();
    },

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
                <ReactPaginate previousLabel={"previous"}
                               nextLabel={"next"}
                               breakLabel={<li className="break"><a href="">...</a></li>}
                               pageNum={this.state.pageNum}
                               marginPagesDisplayed={1}
                               pageRangeDisplayed={2}
                               clickCallback={this.handlePageClick}
                               containerClassName={"pagination"}
                               subContainerClassName={"pages pagination"}
                               activeClass={"active"} />

            </div>
        );
    }
});

module.exports = CatalogPage;
