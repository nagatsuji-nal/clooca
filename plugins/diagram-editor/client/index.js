var React = require('react');
var ReactDOM = require('react-dom');


window.clooca = window.parent.window.clooca;

var Component = require('./components/diagram');

var mainEl = (<div><Component></Component></div>);
ReactDOM.render(mainEl, document.getElementById('main'));

