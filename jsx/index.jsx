 // React app entry point
// TODO: Move these imports to another file
import '../bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../bower_components/odometer/odometer.min.js';
import '../bower_components/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js';
import '../bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js';
import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
// import application
import App from './components/App.jsx';

// silence console logs
//console.log = function(){};

i18next.use(XHR).init({
  'lng' : localStorage.getItem('pureCloudKioskLang'),
  'backend' : {
    'loadPath' : '/locales/{{lng}}.json',
  },
  'fallbackLng' : 'en'
}, (err, t) => {
  console.log('lang loaded');
  console.log(t);
  ReactDOM.render(<App/>, document.getElementById('app'));
});
