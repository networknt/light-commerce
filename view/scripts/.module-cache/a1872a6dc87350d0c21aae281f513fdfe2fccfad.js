/**
 * Created by steve on 07/04/15.
 */
var ModalTrigger = ReactBootstrap.ModalTrigger

var CatalogPage = React.createClass({displayName: "CatalogPage",
    render: function() {
        return (
            React.createElement("div", {class: "row"}, 
                React.createElement("div", {class: "col-md-12"}, 
                    React.createElement("div", {className: "pull-right"}, 
                        React.createElement(CheckoutButton, null)
                    ), 
                    React.createElement("div", {className: "pull-right"}, 
                        React.createElement("button", {className: "btn btn-info"}, React.createElement("i", {className: "glyphicon glyphicon-edit"}), "Checkout")
                    )
                )
            )
        );
    }
});


/*
var SearchForm = React.createClass({
    render: function() {
        return (
            <div>This is a search form.</div>
        );
    }
});


 <form class="search" action="/search">
 <input type="image" src="{{ 'icon-search.png' | asset_url }}" alt="Go" id="go">
 <input type="text" name="q" class="search_box" placeholder="Search" value="{{ search.terms }}" x-webkit-speech />
 </form>


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
