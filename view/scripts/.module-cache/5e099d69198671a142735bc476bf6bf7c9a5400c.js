/**
 * Created by steve on 07/04/15.
 */
var ModalTrigger = ReactBootstrap.ModalTrigger

var CatalogPage = React.createClass({displayName: "CatalogPage",
    render: function() {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement("div", {className: "pull-right"}, 
                        React.createElement(CheckoutButton, null)
                    ), 
                    React.createElement("div", {className: "pull-left"}, 
                        React.createElement(TreePath, null)
                    ), 
                    React.createElement("div", null), 
                    React.createElement("div", {className: "pull-left"}, 
                        React.createElement(SearchForm, null)
                    )
                )
            )
                        
        );
    }
});

var SearchForm = React.createClass({displayName: "SearchForm",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement("input", {type: "text", name: "q", className: "search_box", placeholder: "Search", value: ""}), 
                React.createElement("a", {href: "#search"}, React.createElement("span", {className: "glyphicon glyphicon-search"}))
            )
        );
    }
});

var TreePath = React.createClass({displayName: "TreePath",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement("a", {href: "#"}, "First Catagory"), " > ", React.createElement("a", {href: "#"}, "Second Category"), " > ", React.createElement("a", {href: "#"}, "Third Category")
            )
        );
    }
});

var ProductList = React.createClass({displayName: "ProductList",
    render: function() {
        var productNodes = this.props.data.map(function(product) {
            return (
                React.createElement(Product, {key: product.id, product: product})
            )
        })
        return (
            React.createElement("div", {className: "row"}, 
                productNodes
            )
        )
    }
})

var Product = React.createClass({displayName: "Product",
    /*
    getInitialState: function() {
        return {
            addedToCart: false
        }
    },

    addToCart: function() {
        this.setState({
            addedToCart: true
        })
        productAdded.publish(this.props.product)
    },

    componentDidMount: function() {
        productRemoved.subscribe(this.onProductRemoved)
    },

    componentWillUnmount: function() {
        productRemoved.unsubscribe(this.onProductRemoved)
    },

    onProductRemoved: function(e, removed) {
        if (removed === this.props.product || !removed) {
            this.setState({
                addedToCart: false
            })
        }
    },
    */

    render: function() {
        var classes = cx({
            btn: true,
            'btn-success': true,
            'btn-lg': true,
            'btn-hidden': this.state.addedToCart
        })

        if (config.unit === 'BITS')
            priceStr = this.props.product.priceBits + ' BITS'
        else
            priceStr = this.props.product.price + ' BTC'

        return (
            React.createElement("div", {className: "col-6 col-sm-6 col-lg-4 cat"}, 
                React.createElement("img", {src: this.props.product.image, className: "img-responsive"}), 
                React.createElement("h2", null, this.props.product.name), 
                React.createElement("h4", null,  priceStr ), 
        
            this.state.addedToCart ?
                React.createElement("strong", null, "(Added to Cart)") :
                React.createElement("button", {className: classes, onClick: this.addToCart}, 
                    "Add to Cart"
                )
            
            )
        )
    }
})


/*
var CheckoutDone = React.createClass({
    handleDoneClick: function(e) {
        productRemoved.publish(null)
        this.props.onRequestHide(e)
    },

    render: function() {
        var summaries = this.props.products.map(function(product) {
            return <ProductSummary key={ product.id } product={ product } />
        })

        return (
            <div>
                <div className="modal-body center">
                    <h3>Your cats are on their way!</h3>
                    <h3>(just kidding)</h3>
                    <h5>But here are their favorite quotes on liberty:</h5>
                    <table className="table table-hover">
                        <thead></thead>
                        <tbody>
              { summaries }
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <div className="pull-left">
                        <a href="https://twitter.com/share" className="twitter-share-button" data-text="I just bought some fake cats from the Coinbolt Cat Shop!" data-size="large" data-count="none">Tweet</a>

                    </div>
                    <button type="button" className="btn btn-success" onClick={ this.handleDoneClick }>
                        Done <span className="glyphicon glyphicon-play"></span>
                    </button>
                </div>
            </div>
        )
    }
})

var CheckoutCart = React.createClass({
    render: function() {
        var buyButton
        if (this.props.products.length > 0) {
            buyButton = (
                <button type="button" className="btn btn-success" onClick={this.props.onCheckout}>
                    Buy now <span className="glyphicon glyphicon-play"></span>
                </button>
            )
        }

        return (
            <div>
                <div className="modal-body">
                    <Cart products={ this.props.products } totalPrice={ this.props.totalPrice } totalPriceBits={ this.props.totalPriceBits } />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" onClick={this.props.onRequestHide}>
                        <span className="glyphicon glyphicon-shopping-cart"></span> Continue Shopping
                    </button>
          {buyButton}
                </div>
            </div>
        )
    }
})

 */
var CheckoutModal = React.createClass({displayName: "CheckoutModal",
    getInitialState: function() {
        return {
            screen: this.props.screen || 'cart',
            title: 'Cart'
        }
    },

    onCheckout: function() {
        this.setState({
            screen: 'checkout',
            title: 'Checkout'
        })
    },

    onDone: function() {
        this.setState({
            screen: 'done',
            title: 'Congratulations!'
        })
    },

    render: function() {

        var contents
        if (this.state.screen === 'cart') {
            contents = React.createElement(CheckoutCart, {
                products: this.props.products, 
                onCheckout: this.onCheckout, 
                totalPrice:  totalPrice, 
                totalPriceBits:  totalPriceBits, 
                onRequestHide: this.props.onRequestHide})
        } else if (this.state.screen === 'checkout') {
            contents = React.createElement(CheckoutQr, {
                products:  this.props.products, 
                address: addresses.getPaymentAddress(), 
                totalPrice:  totalPrice, 
                totalPriceBits:  totalPriceBits, 
                onDone: this.onDone, 
                onRequestHide: this.props.onRequestHide})
        } else {
            contents = React.createElement(CheckoutDone, {
                products: this.props.products, 
                onRequestHide: this.props.onRequestHide})
        }

        return this.transferPropsTo(
            React.createElement(Modal, {title:  this.state.title}, 
         contents 
            )
        )
    }
})

var CheckoutButton = React.createClass({displayName: "CheckoutButton",

    getInitialState: function() {
        return {
            products: []
        }
    },

    render: function() {
        return (
            React.createElement(ModalTrigger, {modal: React.createElement(CheckoutModal, {products: this.state.products})}, 
                React.createElement("a", {href: "#cart"}, 
                    React.createElement("span", {className: "glyphicon glyphicon-shopping-cart"}), 
                    React.createElement("span", {className: "badge"}, this.state.products.length), 
                    React.createElement("span", null, "Checkout")
                )
            )
        )
    }
})

React.render(
    React.createElement(CatalogPage, null),
    document.getElementById('content')
);
