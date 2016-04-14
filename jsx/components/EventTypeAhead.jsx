'use strict';
import React, { Component } from 'react';
import requestConstants from '../constants/requestConstants';
import * as pureCloudActions from '../actions/pureCloudActions';
import * as eventActions from '../actions/eventActions';
export default class TypeAhead extends Component{
  constructor(props){
    super(props);
    this.state = {
      'id' : this.props.id,
      'query' :{
        'upcoming' : this.props.query.upcoming,
        'managing' : this.props.query.managing,
        'private' : this.props.query.private,
        'limit' : 10
      },
      'q' : ''
      // 'submitCallback' : this.props.submitCallback,
      // 'transformFunction' : this.props.transformFunction,
      // 'searchUrl' : this.props.searchUrl
    };
  }
  componentWillReceiveProps(newProps){
    this.state.query.upcoming = newProps.query.upcoming;
    this.state.query.managing = newProps.query.managing;
    this.state.query.private = newProps.query.private;
    $('#' + this.state.id).off();
    $('#' + this.state.id).typeahead('destroy');
    this.init();

  }
  init(){
    let engine = new Bloodhound({
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      remote : {
        url : 'api/events/searchEvents',
        prepare : (query, settings) => {
          console.log('prepare')
          console.log(this.state.query);
          this.state.q = query;
          settings.type = 'GET';
          settings.data = $.param(this.state.query) + '&query=' + query,
          settings.headers = {
            'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
          };
          console.log(settings.data);
          return settings;
        },
        transform : (response) => {
          console.log(response);
          let results = [];
          response.forEach((result) => {
            results.push(result.title);
          });
          return results;
        }
      }
    });
    $('#' + this.state.id).typeahead({
      'minLength' : 2,
      'highlight' : true
    }, {
      'name' : 'dataset',
      'limit' : 10,
      'source' : engine
    }).on('typeahead:selected', (e, data) => {
      console.log('Selected');
      console.log(e.target.value);
      this.state.q = e.target.value;
      this.handleSubmit();
    });
    $('#' + this.state.id).keypress((e) => {
      if (e.which == 13) {
        this.handleSubmit();
      }
    });
  }
  componentDidMount(){
    this.init();
  }
  handleInputChange(e){
    let state = this.state;
    state.q = e.target.value;
    this.setState(state);
  }
  handleSubmit(e){
    console.log('submit pressed');
    let query = $.extend(true, {}, this.state.query);
    console.log(query);
    query.query = this.state.q;
    console.log(query);
    eventActions.searchEvents(query);
  }
  render(){
    const {id} = this.state;
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div class='form-group'>
          <label for={id}>Search</label>
          <input id={id} className='form-control' type='text' onChange={this.handleInputChange.bind(this)}
            placeholder='Enter your search query here'/>
        </div>
      </form>
    );
  }
}
