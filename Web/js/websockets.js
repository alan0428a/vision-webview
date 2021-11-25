// This is the JavaScript file for the basic LabVIEW WebSockets demo.
// Copyright © 2016 by MediaMongrels Ltd. 
var socket;  
function connect(){  	
	
	// The LabVIEW demo uses port 6123, but this can be changed to any port. Change 'localhost' if connecting to a server running on another IP address.
	var host = "ws://localhost:6123";  

	try{  
		socket = new WebSocket(host);  

		message('<p class="event">Socket Status: '+socket.readyState);  
		
		// Tell the user the connection has been established
		socket.onopen = function(){  
			message('<p class="event">Socket Status: '+socket.readyState+' (open)');  
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
					break;
				case "history":
					for (let index = 0; index < data.imageResults.length; index++) {
						let imgElementName = `#img-defect-${index + 1}`
						let wrapperElementName = `#img-wrapper-defect-${index + 1}`
						setImage(imgElementName, data.imageResults[index].image)
						setBoarder(wrapperElementName, data.imageResults[index].pass)
					}
					break;
				default:
					console.info(msg.type + ": " + msg.data)
					break;
			}

		}  
		
		// Tell the user the connection has been closed
		socket.onclose = function(){  
			message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');  
		}           

	} catch(exception){  
		message('<p>Error'+exception);  
	}
}

// Send a message to the server
function send(){  
	var text = $('#send-msg').val();  

	if(text==""){  
		message('<p class="warning">Please enter a message');  
		return;  
	}  
	 
	try {  
		socket.send(text);  
		message('<p class="event">Sent: '+text)  

	} catch(exception){  
		message('<p class="warning">');  
	}  
	$('#text').val("");  
}  

// Add the message to the log (and close the paragraph)
function message(msg){  
	// $('#chatLog').append(msg+'</p>');  
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

$('#text').keypress(function(event) {  
	if (event.keyCode == '13') {  
		send();  
	}  
});     

// Close the connection from the client side
$('#disconnect').click(function(){  
	socket.close();  
});  


$(document).ready(function() {  
	
	if(!("WebSocket" in window)){  
		$('#chatLog, input, button, #examples').fadeOut("fast");  
		$('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');  
	} else {  
		//The user has WebSockets  
		connect();  
	
	}
	 //End connect  
  
}); 

