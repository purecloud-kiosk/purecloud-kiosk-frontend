"use strict";
import React, {Component} from "react";
import * as eventsActions from "../actions/eventsActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
//initialize variables
var FileInput = require('react-file-input');
import NumbersWidget from './NumbersWidget';
import EventsTableWidget from './EventsTableWidget';

export default class ImageCropper extends Component {
	constructor(props){
		super(props);
		this.state = {imgUrl : null};
	}
	componentDidMount(){

		// $('#blah').cropper({
		// 	responsive:true,
	 //  		aspectRatio: 16 / 9,
	 //  		crop: function(e) {
	 //    // Output the result data for cropping image.
	 //   		 console.log(e.x);
		// 	  console.log(e.y);
		// 	  console.log(e.width);
		// 	  console.log(e.height);
		// 	  console.log(e.rotate);
		//     console.log(e.scaleX);
		//     console.log(e.scaleY);
		//   }
		// });
	// 	$().cropper('getCroppedCanvas').toBlob(function (blob) {
	// 	  var formData = new FormData();

	// 	  formData.append('croppedImage', blob);

	// 	  $.ajax('/path/to/upload', {
	// 	    method: "POST",
	// 	    data: formData,
	// 	    processData: false,
	// 	    contentType: false,
	// 	    success: function () {
	// 	      console.log('Upload success');
	// 	    },
	// 	    error: function () {
	// 	      console.log('Upload error');
	// 	    }
	// 	  });
	// 	});
	}


	readURL(input) {
		console.log('called');
		
        if (input.target.files && input.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
            	console.log(e.target.result);
                $('#blah').cropper("replace", e.target.result);
            };
            reader.readAsDataURL(input.target.files[0]);
        }
	}

	render() { 

    	var image;
		return(
			<div>
			
				<div className="col-md-10">
					<div>
						<FileInput accept=".png,.gif" onChange={this.readURL.bind(this)} />
						<img id="blah" src={this.state.imgUrl} alt="your image" />
					</div>						
				</div>
			</div>
			);
	}

}
/*


*/