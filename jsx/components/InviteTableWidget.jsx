'use strict';
import React, { Component } from 'react';
import * as navActions from '../actions/navActions';
import * as eventsActions from '../actions/eventsActions';

import LoadingIcon from './LoadingIcon';

var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

export default class InviteTable extends Component {
	constructor(props){
    	super(props);
  	}
    componentDidMount(){
      
    }
   componentWillUnmount(){
    
    }
    handleSelect (index, last) {
    console.log('Selected tab: ' + index + ', Last tab: ' + last);
    }
	render(){
		//var {title, events, faIcon} = this.props;
    	var rows = [], content;
       content = (
          <h4>This Contains how many people have not responded</h4>                   
        );
		return(
      
      <div className='Attendees-table'>
        <div className='widget animated fadeInDown'>
          <div className=''>
            <div className="nav-tabs">
        			 <Tabs
                      onSelect={this.handleSelect}
                      selectedIndex={1}
                    > 
                      <TabList>
                        <Tab>Yes</Tab>
                        <Tab>No</Tab>
                        <Tab>Maybe</Tab>
                        <Tab>Unknown</Tab>
                      </TabList>
                      <TabPanel> 
                        <div>Yes Responses</div>
                        <ul>
                          <li>none </li>
                        </ul>
                      </TabPanel>
                      <TabPanel>
                        <div>No Responses</div>
                        <ul>
                          <li>none </li>
                        </ul>
                      </TabPanel>
                      <TabPanel>
                        <div>Maybe Responses</div>
                        <ul>
                          <li>none </li>
                        </ul>
                      </TabPanel>
                      <TabPanel>
                        <div>Not Responsed Yet</div>
                        <ul>
                          <li>none </li>
                        </ul>
                      </TabPanel>
                </Tabs>
              </div>
            </div>  
          </div>
        </div>
		);
	 }
}
// <div className="search-org">
//             <ul className="list-of-people">
//               <div> Organization List of People </div>
//               <li> John Doe</li>
//               <li> Jack L</li>
//               <li> Beth P</li>
//             </ul>
//           </div>