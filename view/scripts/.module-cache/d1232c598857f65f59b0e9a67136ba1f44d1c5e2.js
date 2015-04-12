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
