'use strict';
import React, {Component} from 'react';
import i18next from 'i18next';
import * as navActions from '../actions/navActions';

export default class SideBar extends Component{
  handleToggleBarClick(){
    navActions.toggleSideBar();
  }
  handleLinkClick(page){
    navActions.routeToPage(page);
  }
  render(){
    return (
      <div id='sidebar-wrapper'>
        <ul className='sidebar'>
          <li className='sidebar-main'>
            <a onClick={this.handleToggleBarClick}>
              PureCloud Kiosk
              <span className='menu-icon glyphicon glyphicon-transfer'></span>
            </a>
          </li>
          <li className='sidebar-title'><span>NAVIGATION</span></li>
          <li className='sidebar-list'>
            <a href='javascript:void(0);' onClick={this.handleLinkClick.bind(this, 'dash')}>
              {i18next.t('DASHBOARD')} <span className='menu-icon fa fa-tachometer'></span>
            </a>
          </li>
          <li className="sidebar-list">
            <a href="javascript:void(0);" onClick={this.handleLinkClick.bind(this, "calendar")}>
              {i18next.t('CALENDAR')} <span className="menu-icon fa fa-table"></span>
            </a>
          </li>
          <li className="sidebar-list">
            <a href="javascript:void(0);" onClick={this.handleLinkClick.bind(this, "search")}>
              {i18next.t('EVENT_SEARCH')} <span className="menu-icon fa fa-search"></span>
            </a>
          </li>
        </ul>
        <div className='sidebar-footer'>
          <div className='col-xs-6'>
            <a href='https://github.com/purecloud-kiosk'>
              Github
            </a>
          </div>
          <div className='col-xs-6'>
            <a href='http://www.inin.com/solutions/pages/cloud-contact-center-purecloud.aspx'>
              {i18next.t('SUPPORT')}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
