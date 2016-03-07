"use strict";
import React, {Component} from "react";
import * as eventsActions from "../actions/eventsActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
//initialize variables
var FileInput = require('react-file-input');

export default class EventSearch extends Component {
	componentDidMount(){
		$('#blah').cropper({
			responsive:true,
  		aspectRatio: 16 / 9,
  		crop: function(e) {
    // Output the result data for cropping image.
   		 console.log(e.x);
		  console.log(e.y);
		  console.log(e.width);
		  console.log(e.height);
		  console.log(e.rotate);
		    console.log(e.scaleX);
		    console.log(e.scaleY);
		  }
		});
	}
	
	 
	readURL(input) {
		console.log('called');
		console.log(input.target.files[0]);
        if (input.target.files && input.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
            	console.log(e.target.result);
                $('#blah')
                    .attr('src', e.target.result)
                    .width(300)
                    .height(300);
            };

            reader.readAsDataURL(input.target.files[0]);
        }
    }
	render() {

		return(

			<div>
				<form>
					<div className="col-md-10">
						<label className ="form-search">Event Search</label>
						<input className="form-control" >
						</input>
						//<button type ="button" onClick={this.myFunction.bind(this)}>Try It</button> 
						<div>
							<FileInput accept=".png,.gif" onChange={this.readURL.bind(this)} />
						
							<img id="blah" src="#" alt="your image" />
						</div>
					</div>
				</form>
				<div>
				<img id="image" src="img/avatar.jpg"/>
				</div>
			</div>




			);


	}
}
//value={event} onChange={this.handleChange("title")}