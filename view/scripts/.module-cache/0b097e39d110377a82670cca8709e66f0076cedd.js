/**
 * Created by steve on 07/04/15.
 */
var ModalTrigger = ReactBootstrap.ModalTrigger

var CatalogPage = React.createClass({displayName: "CatalogPage",
    render: function() {
        return (
          React.createElement("div", null, 
            React.createElement(SearchForm, null), 
            React.createElement(CheckoutButton, null)
          )
        );
    }
});

var SearchForm = React.createClass({displayName: "SearchForm",
    render: function() {
        return (
            React.createElement("div", null, "This is a search form.")
        );
    }
});

var CheckoutCart = React.createClass({displayName: "CheckoutCart",
    render: function() {
        var buyButton
        if (this.props.products.length > 0) {
            buyButton = (
                React.createElement("button", {type: "button", className: "btn btn-success", onClick: this.props.onCheckout}, 
                    "Buy now ", React.createElement("span", {className: "glyphicon glyphicon-play"})
                )
            )
        }

        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "modal-body"}, 
                    React.createElement(Cart, {products:  this.props.products, totalPrice:  this.props.totalPrice, totalPriceBits:  this.props.totalPriceBits})
                ), 
                React.createElement("div", {className: "modal-footer"}, 
                    React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.props.onRequestHide}, 
                        React.createElement("span", {className: "glyphicon glyphicon-shopping-cart"}), " Continue Shopping"
                    ), 
          buyButton
                )
            )
        )
    }
})


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
