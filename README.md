<p align="center">
  <img width="360" src="./src/RTR_Logo.svg">
</p>

### Check it out at [justingruen.com/recordtoprecords](http://www.justingruen.com/recordtoprecords/)

This is the source code for my e-commerce application called RecordTop Records for my Senior Capstone Experience. It's built using Node.js, React,
Firebase, and Material-UI.

## Getting Started

First, head to [console.firebase.google.com](https://console.firebase.google.com/) and add a new project. Afterwards, head to the project settings
and grab the firebase config info. While there, head to the Authentication tab and enable Email/Password sign-in methods.

In ./src/components/Firebase/firebase.js, replace paste the current const config with the firebase config info from earlier. Under doSendEmailVerification, 
replace 'process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT' with your website address (ie. http://localhost:3000)

Finally, open the terminal and run 
```bash
npm start
```
