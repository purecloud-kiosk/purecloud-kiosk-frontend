'use strict';
import React, { Component } from 'react';

/**
 *  As simple modal. You can render data within this by passing in child components.
 *
 *  Ex. <Modal ...> <span> Hello </spn> </Modal>
 *  will show 'Hello' within the modal
 **/
export default class Modal extends Component{
  constructor(props){
    super(props);
  }
  render(){
    var {id, title, content} = this.props;
    return (
      <div id={id} className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
              <div className='clear'></div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}