const bcrypt = require("bcryptjs");
const user = require("../models/user");

password="123456";
//hashedPassword = "";
const saltRounds = 10;


async function hashPass(){

  let user =[]
   await bcrypt.hash(password,saltRounds)
  .then( hashedPassword=> {

    user=[
      {
        "_id": "650dade494237ad07eedc7ee",
        "username": "Jean-Michel",
        "password": `${hashedPassword}`,
        "email": "user1@gare.ca",
        "isValet": false,
        "voiture": "650e08dc63d222e2c0afc396"
      }, {
        "_id": "650dadf594237ad07eedc7f0",
        "username": "Claire",
        "password": `${hashedPassword}`,
        "email": "user2@gare.ca",
        "isValet": true,
        "voiture": "650e404b63d222e2c0afc397"
      }, {
        "_id": "650dcaf47bc86e471e5c0af6",
        "username": "Jean",
        "password": `${hashedPassword}`,
        "email": "user3@gare.ca",
        "isValet": false,
        "voiture": "650e404b63d222e2c0afc398"
      }, {
        "_id": "650dade494237ad17eedc7ee",
        "username": "Jeanne",
        "password": `${hashedPassword}`,
        "email": "user4@gare.ca",
        "isValet": false,
        "voiture": "650e404b63d222e2c0afc399"
      }, {
        "_id": "650dcaf47bc86e971e5c0af6",
        "username": "Johf",
        "password": `${hashedPassword}`,
        "email": "user5@gare.ca",
        "isValet": false,
        "voiture": "650e404b63d222e2c0afc39a"
      }, {
        "_id": "650dbef77bc86e471e5c0af6",
        "username": "cegep",
        "password": `${hashedPassword}`,
        "email": "valet@gare.ca",
        "isValet": true,
        "price": 8,
        
      }]
    

  })
  
  //console.log("user", hashedPass)

    
  
  
  
  return user
    
}

//let users=hashPassword()


module.exports = hashPass