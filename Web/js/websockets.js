// This is the JavaScript file for the basic LabVIEW WebSockets demo.
// Copyright © 2016 by MediaMongrels Ltd. 
var socket; 
var prevTime = null
var elapsedTime;
function connect(){  	
	
	// The LabVIEW demo uses port 6123, but this can be changed to any port. Change 'localhost' if connecting to a server running on another IP address.
	var host = "ws://localhost:6123";  

	try{  
		socket = new WebSocket(host);  

		message('Socket Status: '+socket.readyState);  
		
		// Tell the user the connection has been established
		socket.onopen = function(){  
			message('Socket Status: '+socket.readyState+' (open)');  
		}  
		
		// Display the received message
		socket.onmessage = function(msg){  
			// message('<p class="message">Received: '+msg.data);  
			
			var data = JSON.parse(msg.data);

			switch(data.type) {
				case "latest":
					var imgResult = data.imageResults[0]
					setImage('#img-source', imgResult.image)
					setBoarder('#img-wrapper-source', imgResult.pass)
					if(prevTime == null)
					{
						prevTime = Date.now();
					}
					else
					{
						current = Date.now()
						elapsedTime = current - prevTime
						//console.log(elapsedTime)
						prevTime = current
					}
					break;
				case "history":
					for (let index = 0; index < data.imageResults.length; index++) {
						let imgElementName = `#img-defect-${index + 1}`
						let wrapperElementName = `#img-wrapper-defect-${index + 1}`
						setImage(imgElementName, data.imageResults[index].image)
						setBoarder(wrapperElementName, data.imageResults[index].pass)
					}
					break;
				case "statistics":
					updateChart(data.count.ok, data.count.ng)
					$('#ok-count').text(data.count.ok)
					break;
				default:
					console.info(msg.type + ": " + msg.data)
					break;
			}

		}  
		
		// Tell the user the connection has been closed
		socket.onclose = function(){  
			message('Socket Status: '+socket.readyState+' (Closed)');  
		}           

	} catch(exception){  
		message('Error'+exception);  
	}
}

// Add the message to the log (and close the paragraph)
function message(msg){  
	console.info(msg)
}

function setBoarder(elementName, result){
	let wrapperElement = $(elementName)
	if(result)
	{
		if(wrapperElement.hasClass("ng"))
		{
			wrapperElement.removeClass("ng")
		}
		wrapperElement.addClass("ok")
	}
	else
	{
		if(wrapperElement.hasClass("ok"))
		{
			wrapperElement.removeClass("ok")
		}
		wrapperElement.addClass("ng")
	}
}

function setImage(elementName, image){
	$(elementName).attr("src","data:image/png;base64,"+ image)
}

$(document).ready(function() {  
	
	if(!("WebSocket" in window)){  
		$('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');  
	} else {  
		//The user has WebSockets  
		connect();  
	
	}
	 //End connect  
  
}); 

