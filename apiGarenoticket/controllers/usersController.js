const User = require('../models/user');
const Voiture = require('../models/voiture');
const Histo = require('../models/historique');
const config = require('../config');
const { use } = require('../routes/user');
const url_base = config.URL + ":" + config.PORT;
const bcrypt = require('bcryptjs');



exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isValet: false }).populate({
      path: 'voiture',
      match: { isParked: true }
    });

    const filteredUsers = users.filter(user => user.voiture != null);
    if (!filteredUsers.length) {
      const error = new Error('Aucun utilisateur trouvé.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      users: filteredUsers
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    //console.log("user", req.user.username)
    const userId = req.user.userId;

    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
   
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};



exports.updateUser = async (req, res, next) => {

  try {
    const userId = req.params.userId;
   
    const user = await checkUserExists(userId);


    if(user.isValet){
      user.price=req.body.price

     }

    user.email=req.body.email;

    // const hashedPassword = await bcrypt.hash(req.body.password,10);

    // if(user.password!=hashedPassword){
    //   user.password=hashedPassword;
    // }


    
    user.username=req.body.username;
    //user.password=req.body.password;

    const result = await user.save()
    res.status(200).json(result);
  } catch (err) {
    console.log("erreur",err)
    next(err);
    
  }

}

exports.updateCar = async (req, res, next) => {

  try {
    const userId = req.params.userId;
    //console.log(userId);
    const user = await checkUserExists(userId);
    ///console.log("voiture",user.voiture.isMoving);
   
    
    let car =user.voiture
    var result=null
    if(!car){
     car=new Voiture()

     console.log("je suis dedans",req.body.plaque )
     car.marque=req.body.marque;
     car.modele=req.body.modele;
     car.couleur=req.body.couleur;
     car.plaque=req.body.plaque;
      result = await car.save()
    
     user.voiture=car._id
     await user.save()
     
    }
    else{
      

    if(req.body.marque !== undefined)
      car.marque=req.body.marque;
    if(req.body.modele !== undefined)
      car.modele=req.body.modele;
    if(req.body.couleur !== undefined)
      car.couleur=req.body.couleur;
    if(req.body.plaque !== undefined)
      car.plaque=req.body.plaque;
    let isMoving=req.body.isMoving
    if(isMoving!==undefined ){
     
      car.isMoving=isMoving
      
    } 
    let isParked =req.body.isParked
    if(isParked !== undefined)
      car.isParked=isParked

    if(req.body.latitude !== undefined)
      car.latitude=req.body.latitude

    if(req.body.longitude !== undefined)
      car.longitude=req.body.longitude

    if(req.body.timeToLeave !== undefined){
      car.timeToLeave =req.body.timeToLeave
    }
    
     result = await car.save()
    
      // if(req.body.valet !== undefined){
      //  var resultHisto = await creerHistorique(user.id,user.voiture.valet)
      // }

      var resultHisto = await creerHistorique(user.id,user.voiture.valet)
    }
   
    
   
    res.status(200).json(resultHisto);
  } catch (err) {
    next(err);
  }
 }



exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await checkUserExists(userId);
    await user.remove();
    if (user.voiture) {
      const voiture = await Voiture.findById(user.voiture);
      await voiture.remove();
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Fonction pour vérifier si un utilisateur existe
async function checkUserExists(userId) {
  const user = await User.findById(userId).populate('voiture');
  if (!user) {
    const error = new Error('L\'utilisateur n\'existe pas.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

async function creerHistorique(idUser, idValet){

    try {
      
      const user = await checkUserExists(idUser);
      const valet = await checkUserExists(idValet);

      let histo = new Histo()

      histo.price=valet.price;
      histo.isPaid=false;
      histo.userId=user.id;
      histo.valetId=valet.id;
      
      const result = await histo.save();
     console.log("historique",  res.status(200).json(result))
      return result

    } catch (error) {
      next(err);
    }

}