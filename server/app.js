//Edit the config, if you want.
var config = {
	port: 2082, //Port to listen for connections on. Default: 2082
	plugins: [] //COMING SOON MAYBE (TM)
}

////////////////////////////////
//Please don't edit past here.//
//If you do, you won't get any//
//        support!            //
////////////////////////////////

const http = require('http'); //Initialise the http module/variable

var app = http.createServer(function(req,res) { //create a server that on a request (thats not a socket)...
	res.writeHead(200, {'Content-Type': 'text/html'}); //Make a (valid) header
	res.end('index'); //Write "index" onto the page, and end the request
});

var io = require('socket.io').listen(app); //Enable socket.io
var clients = []; //initialize the clients variable - this is so that multiple clients can connect (though it's not recommended, and can easily gety confusing!)
var id = -1;
io.on('connection', function(socket) { //When a client connects...
	id++;
	socket.id = id;
	clients[id] = socket;
	console.log("New connection! Id:"+socket.id);
	socket.on('message', function(data) { //On a message (this can be a log message from the child process, or, well, anything.) 
		console.log(data.msg); //Log it!
	});
	
	socket.on('error', function(data) { //On an error (should only be emitted on actual child process errors!)
		console.log("[ERROR]: "+data.err);
	});

	socket.on('child-close', function(data){ //When the child process closes, and the event is emitted:
	    console.log("[SERVER-CLOSE]: "+data.msg); //Log that it happened.
	});
	
	socket.on('disconnect', function(socket) { //On disconnect...
		delete clients[socket.id]
	});
});

process.stdin.on('data',function(data) { //When something is typed into the console...
	clientData = data.toString().replace(/(\n|\r)+$/, '');
	if (clientData == `cls` || clientData == `clear`) {
		return process.stdout.write("\x1B[2J\x1B[0f"); //Clear the terminal. If it doesn't work, your OS just doesn't support it. Sorry!
	} else if (clientData == "showSockets") {
		return console.log(clients);
	}
	for (var i=0;i<clients.length;i++) { //For each client...
		clients[i].emit('input',{msg:`${data}`}); //Emit an 'input' event
	}
});

app.listen(config.port, (err) => {
	if (err) {
		return console.log('Error! Something went wrong while starting the server! '+`\n`+err);
	}
	console.log('Now accepting connections on port: '+config.port+`\n`+'Make sure that your clients are connecting on that port!');
}); //Start the http/socket.io server! Ouput errors if any exist.
