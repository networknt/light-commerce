'use strict';

var React = require('react');
var CatalogPage = require('./scripts/component/CatalogPage');
require('./assets/css/demo.css');

React.render(
  <CatalogPage />,
  document.getElementById('content')
);
