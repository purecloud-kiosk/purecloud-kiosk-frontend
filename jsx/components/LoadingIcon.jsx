'use strict';
import React, { Component } from 'react';

export default class LoadingIcon extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className='loading-icon'>
        <i className='fa fa-refresh fa-spin fa-5x icon'></i>
      </div>
    );
  }
}
