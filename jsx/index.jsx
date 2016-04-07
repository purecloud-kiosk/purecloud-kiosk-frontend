 // React app entry point
// TODO: Move these imports to another file
import '../bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../bower_components/odometer/odometer.min.js';
import '../bower_components/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js';
import '../bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js';
import React from 'react';
import ReactDOM from 'react-dom';

// import application
import App from './components/App.jsx';

ReactDOM.render(<App/>, document.getElementById('app'));
