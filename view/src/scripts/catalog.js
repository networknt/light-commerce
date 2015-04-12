/**
 * Created by steve on 07/04/15.
 */

var ModalTrigger = ReactBootstrap.ModalTrigger
var cx = function classNames() {
    var classes = '';
    var arg;

    for (var i = 0; i < arguments.length; i++) {
        arg = arguments[i];
        if (!arg) {
            continue;
        }

        if ('string' === typeof arg || 'number' === typeof arg) {
            classes += ' ' + arg;
        } else if (Object.prototype.toString.call(arg) === '[object Array]') {
            classes += ' ' + classNames.apply(null, arg);
        } else if ('object' === typeof arg) {
            for (var key in arg) {
                if (!arg.hasOwnProperty(key) || !arg[key]) {
                    continue;
                }
                classes += ' ' + key;
            }
        }
    }
    return classes.substr(1);
}

var products =
    [
        {
            "id": 0,
            "title": "Silver beet",
            "description": "Silver beet shallot wakame tomatillo salsify mung bean beetroot groundnut.",
            "image": "imgs/1.jpg",
            "sku": 429718,
            "price": 19.99,
            "type": "22oz Bottle",
            "inventory": 8
        },
        {
            "id": 1,
            "title": "Wattle seed",
            "description": "Wattle seed bunya nuts spring onion okra garlic bitterleaf zucchini.",
            "image": "imgs/2.jpg",
            "sku": 122057,
            "price": 22.99,
            "type": "22oz Bottle",
            "inventory": 7
        },
        {
            "id": 2,
            "title": "Kohlrabi bok",
            "description": "Kohlrabi bok choy broccoli rabe welsh onion spring onion tatsoi ricebean kombu chard.",
            "image": "imgs/3.jpg",
            "sku": 620515,
            "price": 5.99,
            "type": "22oz Bottle",
            "inventory": 1
        },
        {
            "id": 3,
            "title": "Melon sierra",
            "description": "Melon sierra leone bologi carrot peanut salsify celery onion jícama summer purslane.",
            "image": "imgs/4.jpg",
            "sku": 193901,
            "price": 12.99,
            "type": "22oz Bottle",
            "inventory": 1
        },
        {
            "id": 4,
            "title": "Celery carrot",
            "description": "Celery carrot napa cabbage wakame zucchini celery chard beetroot jícama sierra leone.",
            "image": "imgs/5.jpg",
            "sku": 963029,
            "price": 15,
            "type": "22oz Bottle",
            "inventory": 4
        },
        {
            "id": 5,
            "title": "Catsear",
            "description": "Catsear cabbage tomato parsnip cucumber pea brussels sprout spring onion shallot swiss .",
            "image": "imgs/6.jpg",
            "sku": 117159,
            "price": 20,
            "type": "22oz Bottle",
            "inventory": 5
        },
        {
            "id": 6,
            "title": "Mung bean",
            "description": "Mung bean taro chicory spinach komatsuna fennel.",
            "image": "imgs/7.jpg",
            "sku": 352054,
            "price": 10,
            "type": "22oz Bottle",
            "inventory": 5
        },
        {
            "id": 7,
            "title": "Epazote",
            "description": "Epazote soko chickpea radicchio rutabaga desert raisin wattle seed coriander water.",
            "image": "imgs/8.jpg",
            "sku": 801488,
            "price": 34.99,
            "type": "22oz Bottle",
            "inventory": 8
        },
        {
            "id": 8,
            "title": "Tatsoi caulie",
            "description": "Tatsoi caulie broccoli rabe bush tomato fava bean beetroot epazote salad grape.",
            "image": "imgs/9.jpg",
            "sku": 316395,
            "price": 21.50,
            "type": "22oz Bottle",
            "inventory": 7
        },
        {
            "id": 9,
            "title": "Endive okra",
            "description": "Endive okra chard desert raisin prairie turnip cucumber maize avocado.",
            "image": "imgs/10.jpg",
            "sku": 510772,
            "price": 18.50,
            "type": "22oz Bottle",
            "inventory": 4
        },
        {
            "id": 10,
            "title": "Bush tomato",
            "description": "Bush tomato peanut shallot turnip prairie turnip gram desert raisin.",
            "image": "imgs/1.jpg",
            "price" : 12.99,
            "sku": 361028,
            "price": 9,
            "type": "22oz Bottle",
            "inventory": 4
        },
        {
            "id": 11,
            "title": "Yarrow leek",
            "description": "Yarrow leek cabbage amaranth onion salsify caulie kale desert raisin prairie turnip garlic.",
            "image": "imgs/1.jpg",
            "sku": 351541,
            "price": 22.50,
            "type": "22oz Bottle",
            "inventory": 2
        }
    ];

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
                        <div></div>
                        <div className="pull-left">
                            <SearchForm/>
                        </div>
                    </div>
                </div>
                <ProductList data={products} />
            </div>
        );
    }
});

var SearchForm = React.createClass({
    render: function() {
        return (
            <div>
                <input type="text" name="q" className="search_box" placeholder="Search" value=""/>
                <a href="#search"><span className="glyphicon glyphicon-search"></span></a>
            </div>
        );
    }
});

var TreePath = React.createClass({
    render: function() {
        return (
            <div>
                <a href="#">First Catagory</a>&nbsp;&gt;&nbsp;<a href="#">Second Category</a>&nbsp;&gt;&nbsp;<a href="#">Third Category</a>
            </div>
        );
    }
});

var ProductList = React.createClass({
    render: function() {
        var productNodes = this.props.data.map(function(product) {
            return (
                <Product key={product.id} product={product} />
            )
        })
        return (
            <div className="row">
                {productNodes}
            </div>
        )
    }
})

var Product = React.createClass({
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

    render: function() {
        var classes = cx({
            btn: true,
            'btn-success': true,
            'btn-lg': true,
            'btn-hidden': this.state.addedToCart
        })

        priceStr = '$' + this.props.product.price;

        return (
            <div className="col-6 col-sm-6 col-lg-4 cat">
                <img src={this.props.product.image} className="img-responsive" />
                <h2>{this.props.product.title}</h2>
                <h4>{ priceStr }</h4>
        {
            this.state.addedToCart ?
                <strong>(Added to Cart)</strong> :
                <button className={classes} onClick={this.addToCart}>
                    Add to Cart
                </button>
            }
            </div>
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
var CheckoutModal = React.createClass({
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
            contents = <CheckoutCart
                products={this.props.products}
                onCheckout={this.onCheckout}
                totalPrice={ totalPrice }
                totalPriceBits={ totalPriceBits }
                onRequestHide={this.props.onRequestHide} />
        } else if (this.state.screen === 'checkout') {
            contents = <CheckoutQr
                products={ this.props.products }
                address={addresses.getPaymentAddress()}
                totalPrice={ totalPrice }
                totalPriceBits={ totalPriceBits }
                onDone={this.onDone}
                onRequestHide={this.props.onRequestHide} />
        } else {
            contents = <CheckoutDone
                products={this.props.products}
                onRequestHide={this.props.onRequestHide} />
        }

        return this.transferPropsTo(
            <Modal title={ this.state.title }>
        { contents }
            </Modal>
        )
    }
})

var CheckoutButton = React.createClass({

    getInitialState: function() {
        return {
            products: []
        }
    },

    render: function() {
        return (
            <ModalTrigger modal={<CheckoutModal products={this.state.products} />}>
                <a href="#cart">
                    <span className="glyphicon glyphicon-shopping-cart"></span>
                    <span className="badge">{this.state.products.length}</span>
                    <span>Checkout</span>
                </a>
            </ModalTrigger>
        )
    }
})

React.render(
    <CatalogPage/>,
    document.getElementById('content')
);
