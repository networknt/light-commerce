'use strict';

var React = require('react');
var CatalogPage = require('./scripts/component/CatalogPage');
require('./assets/css/demo.css');

React.render(
  <CatalogPage url={'http://example:8080/api/rs'} perPage={10} />,
  document.getElementById('catalog_content')
);
