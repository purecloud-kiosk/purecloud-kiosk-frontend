 // React app entry point
// jquery was moved to cdn
import '../bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../bower_components/odometer/odometer.min.js';
// Chartjs also moved to a cdn
//import '../bower_components/Chart.js/Chart.min.js';
import React from 'react';
import ReactDOM from 'react-dom';

// import application
import App from './components/App.jsx';

ReactDOM.render(<App/>, document.getElementById('app'));
