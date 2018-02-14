//Edit your config!
const config = {
	host: "your.host.goes.here",                        //Hostname to the server.
	port: 2082,                                         //Port to connect through. Default: 2082
	child_process: "java",                              //Program to run.
	child_args: ['-Xmx6G','-jar','server.jar','nogui'], //Child process arguments. Can be empty.
	child_working_dir: "Path:\\to\\your\\working\\dir", //Path to the child process' working directory.
	reboot_server: true                                 //EXPERIMENTAL. Reboots the child process when it exits... in theory.
}

////////////////////////////////
//Please don't edit past here.//
//If you do, you won't get any//
//        support!            //
////////////////////////////////


const spawn = require('child_process').spawn; //Get spawn function
const io = require('socket.io-client'); //Get the socket.io client constructor
const client = io(config.host); //Create a socket.io client
var child;

function reload() {
    child = spawn(config.child_process,config.child_args,{cwd: config.child_working_dir}); //Spawn child process
	child.stdout.on('data', function(data) { //When a child log message happens
		var formattedData = data.toString().trim();
		client.emit('message',{msg:formattedData}); //Emit the data to the socket
		console.log(formattedData); //Log the data
	});

	child.stderr.on('data', function(data) { //When a child process error occurs
		var formattedData = data.toString().trim();
		client.emit('error',{err:formattedData}); //Emit the error to the socket
		console.log(formattedData); //Log the error (continue, if possible!)
	});

	child.on('close', function (code1) { //When the child process closes (but not the node process)
		client.emit('child-close',{msg:'SERVER PROCESS EXITED!!! CODE: ' + code1,code:code1}); //Emit a panic-message
		console.log('SERVER EXITED! CODE: '+code1); //Log a panic message
		if (config.reboot_server == true) { //Reboot the server, but only if enabled.
			reload();
		}
	});
}

reload();

client.on('input', function(input) { //On a "input" event from the server
	console.log(`${input.msg}`); //Log the message
	child.stdin.write(`${input.msg}`); //Run the message through the child process.
});

process.stdin.on('data',function(data) {
	var formattedData = data.toString().trim();
	if (formattedData == "cls" || formattedData == "clear") {
		return process.stdout.write("\x1B[2J\x1B[0f"); //Clear the terminal. If it doesn't work, your OS just doesn't support it. Sorry!
	} else if (formattedData == "reconnect") {
		reconnect();
	} else {
		child.stdin.write(`${data}`);
	}
});

function reconnect() {
	console.log("Disconnecting from server...");
	client.emit('disconnect');
	client.close();
	var a= setTimeout(function() {
		console.log("Connecting to server...");
		client.open();
		clearTimeout(a);
	},100);
}

client.connect(); //Connect the client (server) to the socket.io server (client). Not confusing at all, what are you talking about!?
