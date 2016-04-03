'use strict';
import React, { Component } from 'react';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';

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
          <div className='widget-header'>
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
                      <div>This is people who have said yes</div>
                      <div>Some garbage Data that fills in the space </div>
                    </TabPanel>
                    <TabPanel>
                      <div>This is people who have said no</div>
                      <div>Some garbage Data that fills in the space </div>
                    </TabPanel>
                    <TabPanel>
                      <div>This is people who have said maybe</div>
                      <div>Some garbage Data that fills in the space </div>>
                    </TabPanel>
                    <TabPanel>
                      <div>This is people who have not decided</div>
                      <div>Some garbage Data that fills in the space </div>
                    </TabPanel>
              </Tabs>
            </div>  
          </div>
        </div>
		);
	 }
}
