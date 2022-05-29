# Microsoft-Engage-22

## Introduction
This recommendation system is primarily based on content based filtering.This model's prediction is based upon the users preferences in various categories like genre, language,IMDB rating etc.This gives the top 5 recommended movies for the user.

## Prequsites
- Python3.9
- NodeJS 
- NPM


## Steps to run the program
 - Open terminal and create a folder on the local system
 - Clone the repository to this folder.
 - Install nodejs packages present in the package.json file. Run the below command to install the npm packages.
 ```
 npm install
 ```
 - Install python packages present in the requirements.txt file. Run the below command to install the python packages.
 ```
 pip install -r requirements.txt
 ```
 - Install the following dependencies
 ```
 npm i express
 npm i mongoose
 npm i hbs
 npm i python-shell
 ```
## How to run the program
- Open the project and run the app.js file.
- Then console will display 
```
Server is running at port no 3000
Connected to mongoDB
```
- On web browser and type
```
localhost:3000
```
- Then Myflix page will be opened with register and login options
- If the user is new, the app would direct the user to the registration page .
- Then the user logins through loginpage.If the user credentials matches with stored value in the database, then it will direct the user to movies page, else the user will be directed to error page.
- Once the movies page opens,user have to choose movies according to their choice.
- Once the choices are submitted then the recommendation engine gets triggered and top 5 recommended movies will be displayed. 
## Database hosting
- Database is hosted on free public cluster in mongodb atlas.The url is already embedded in the code.
- In case of any problem, the username is shreeya and password is engage1
- When I used database on localhost it took 1-2secs to run but when the database is hosted in free tier cluster it is taking 9-10 secs to establish a connection between python and mongodb using pymongo client
## Website Demo
 - ["Youtube Link"](https://youtu.be/9eZ74_I0sIE)



