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
  onClosePressed(){
    $('#' + this.props.id).modal('hide');
  }
  render(){
    var {id, title, size, submitCallback, submitText, cancelText} = this.props;
    let submitButton;
    if(cancelText === undefined)
      cancelText = 'Cancel';
    if(submitText === undefined)
      submitText = 'Submit';
    if(submitCallback !== undefined){
      console.log('submit defined')
      submitButton = <button type="button" className="btn btn-primary pull-left" onClick={submitCallback}>{submitText}</button>;
    }
    else{
      console.log('submit not defined');
    }

    return (
      <div id={id} className="modal fade" role="dialog">
        <div className={"modal-dialog " + size}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.onClosePressed.bind(this)}>
                &times;
              </button>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
              <div className='clear'></div>
            </div>
            <div className="modal-footer">
              {submitButton}
              <button type="button" className="btn btn-default" onClick={this.onClosePressed.bind(this)}>
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
