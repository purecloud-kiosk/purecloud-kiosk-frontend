'use strict';
import React, { Component } from 'react';
import requestConstants from '../constants/requestConstants';
import * as pureCloudActions from '../actions/pureCloudActions';
export default class TypeAhead extends Component{
  constructor(props){
    super(props);
    this.state = {
      'id' : this.props.id,
      'query' : ''
      // 'submitCallback' : this.props.submitCallback,
      // 'transformFunction' : this.props.transformFunction,
      // 'searchUrl' : this.props.searchUrl
    };
  }
  componentDidMount(){
    let engine = new Bloodhound({
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      remote : {
        url : 'api/purecloud/searchPeople',
        prepare : (query, settings) => {
          settings.type = 'GET';
          settings.data = 'q=' + query,
          settings.headers = {
            'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
          };
          return settings;
        },
        transform : (response) => {
          let results = [];
          response.res.forEach((result) => {
            results.push(result.general.name[0].value);
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
      this.handleSubmit();
    });
    $('#' + this.state.id).keypress((e) => {
      if (e.which == 13) {
        this.handleSubmit();
      }
    });
  }
  handleInputChange(e){
    let state = this.state;
    state.query = e.target.value;
    this.setState(state);
  }
  handleSubmit(e){
    console.log('submit pressed');
    pureCloudActions.searchUsers(this.state.query)
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
