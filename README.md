
# React-Redis-Express-Mysql-project

This is complete sample project, where a React application displays and create data using a backend api.


## Project Details

This project has been devided by 3 modules:  

    1. A React Application  
    2. A Backend Node Server
    3. A Wroker server

We also need a SQL server to store data and a redis cache server to cache data and to act as queue.

## Data read architecture

![My Image](Read.png)








## Data write architecture
![My Image](Write.png)





## Project run
Here are 3 different servers to run the full Application. Currently there is no docker file, so some per-installed software needed to run the projects

#### Client Application - React
We need to install Node.js at first, then go to the directory named "my-react" and run  "npm install". This will install all the dependecies of the project.  
  
Then change the port inside the src->App.jsx file at line number 12 to the desired port where the backend server is runnig.

Now run the command "npm run dev" to initialize the project.


#### Backend server - Node/Express js
Go to the directory named "my-express-redis" and run "npm install" this will intall all the dependecies.

We need to set the redis server credential and port number in the index.js file at line number 19. the url would look like this "redis://USER_NAME:PASSWORD@HOST:DESIRED_PORT"

By default this will run in the 5000 port, but you can change it whatever you want in the indes.js file at line number 93.

now run "Node index.js" to run the backend server



#### Worker server - Node/Express js

Go to the directory named "my-worker-server" and run "npm install" this will intall all the dependecies.

We need to set the redis server credential and port number in the index.js file at line number 19 same as before.

We need to additionally set up a MySql server this time in the index.js file.Use your own credendial in the "sqlDbConfig" variable.

now run "Node index.js" to run the backend server
