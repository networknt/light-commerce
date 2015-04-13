/**
 * Created by steve on 12/04/15.
 */
var React = require('react');
var ReactPropTypes = React.PropTypes;
var ProductActionCreator = require('../action/ProductActionCreator');
var CartActionCreator = require('../action/CartActionCreator');
var VariantSelect = require('./VariantSelect');
var _ = require('lodash');

var Product = React.createClass({

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    render: function() {

        var product = this.props.product;
        var variantIndex, i = product.variantIndex;
        var variants = product.variants;
        var inventory = variants[i].inventory;
        var price = variants[i].price.toFixed(2);
        var variantProps = {
            variants: variants,
            id: product.id
        };

        return (
            <div className="col-4 col-sm-4 col-lg-3">
                <img src={'/assets/images/' + this.props.product.image} className="img-responsive" />
                <h3>{this.props.product.title}</h3>
                <h4>{ price }</h4>
                <div className="cbp-vm-details">
                    {product.description}
                </div>
                <div>
                    {(_.size(variants) > 1) ?
                    <VariantSelect {...variantProps} /> :
                    product.variants[i].type + ' $' + price}
                </div>
                <button
                    className="cbp-vm-icon cbp-vm-add"
                    onClick={this._addToCart}
                    disabled={inventory === 0}
                >
                {inventory > 0 ? 'Add to cart' : 'Sold Out!'}
                </button>
            </div>
        )
    },

    _addToCart: function(e) {
        e.preventDefault();
        var product = this.props.product;
        CartActionCreator.addToCart(product);
        ProductActionCreator.removeOneFromInventory(product);
    }
});

module.exports = Product;