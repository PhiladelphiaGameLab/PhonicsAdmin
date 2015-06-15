/*---------------- AJAX FUNCTIONS ------------------*/

/* 
 * Makes the AJAX calls to Lux specifically
 * Handles the Authorization stuff as well, 
 * so that the user does not have to
 */
function Ajax(urlCall, data, callback){ // done and functional
	var url = getJsonFromUrl();
        var http = new XMLHttpRequest();
        http.onreadystatechange=function(){
                if(http.readyState==4 && http.status==200){
                        console.log(http.responseText);
			try{
                        	callback(JSON.parse(http.responseText));
			}catch(err){
                        	callback(http.responseText);
			}
                }
        }
	console.log(JSON.stringify(data));
        
	urlBase = "http://demo.philadelphiagamelab.org/Lux/";
        http.open("POST", urlBase + urlCall,  true);
        http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        http.send(JSON.stringify(data));
}
/* This is the function that needs to be used when uploading a file 
 * To the server, it is not possible to simply use the AJAX function 
 * above, because it does not have the file handler
 */
function AjaxUpload(fileHandler, name){// done and functional
     	if(fileHandler.files[0].set != undefined && fileHandler.files[0].set){
		return;
	}	
	var url = getJsonFromUrl();
        var http = new XMLHttpRequest();
        http.onreadystatechange=function(){
                if(http.readyState==4 && http.status==200){
                        console.log("UPLOADED---------------");
			console.log(http.responseText);
                }
        }
     	
	/* Create a FormData instance */
      	var formData = new FormData();

	/* Display the progress of the upload */
	http.upload.onprogress = function(e) {
	    if (e.lengthComputable) {
	      var percentComplete = (e.loaded / e.total) * 100;
	      console.log(percentComplete + '% uploaded');
	    }
	  };

      	formData.append("file", fileHandler.files[0]);
      	formData.append("name", name);
	
	/* Send the Request to the server */
        urlBase = "http://demo.philadelphiagamelab.org/Lux/";
        http.open("POST", urlBase + "Upload/upload.php?access_token="+url.access_token);
      	http.send(formData);  /* Send to server */ 
}
/*
 * This function can be used to display an image that is stored on 
 * the local machine. For instance, in the case of an upload.
 */
function displayImage(fileHandler, imageArea){
	if ( window.FileReader ) {
	  reader = new FileReader();
	  reader.onloadend = function (e) { 
		var list = fileHandler.parentNode,
		li   = document.createElement("li"),
		img  = document.createElement("img");
		img.src = e.target.result;
		li.appendChild(img);
		imageArea.appendChild(li);
	  };
	  reader.readAsDataURL(fileHandler.files[0]);
	}
}

/* Pretty self explanitory */
function getJsonFromUrl() {// done and functional
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
var url = getJsonFromUrl();
