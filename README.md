# node-remote-cmd
A remote console. Designed for Minecraft servers, but works for just about any CLI program!

# INSTALLATION
Installation couldn't be much simpler! Download the zip files for each side, and npm install! You need to port forward as well!
    
    1. Download and install NodeJS https://nodejs.org/
    
    2. Download the zip files.
        THE CLIENT RUNS THE CHILD PROCESS. So, you want to download the CLIENT on the computer running the program, and the SERVER on the computer getting the output.
    
    3. Extract the zip files to where you want them.
    
    4. Edit your config! Just open the app.js for the client, and set up your hostname and chhild process and it's arguments. You can also change the port, in the (rare) case you are already using it, through the server's app.js as well as the client's.
    
    5. Open a command window in the folders, and run 'npm install' this will download the dependencies needed.
    
    6. PORT FORWARD. I'm not going to help you do this, look up a tutorial if you need.
# RUNNING
Running the program is super easy. All you have to do is open a CMD/Powershell/Bash (anything along those lines work) window in the folder you've put the scripts in and run `node app` If you get any issues connecting, make sure you have port forwarded properly. If that doesn't work, try running the server first, and THEN the client.
