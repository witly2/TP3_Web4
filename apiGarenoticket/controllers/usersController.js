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
    console.log(userId);
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
    console.log(userId);
    const user = await checkUserExists(userId);

    user.email=req.body.email;

    const hashedPassword = await bcrypt.hash(req.body.password,10);

    if(user.password!=hashedPassword){
      user.password=hashedPassword;
    }


    
    user.username=req.body.username;
    //user.password=req.body.password;

    const result = await user.save()
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }

}

exports.updateCar = async (req, res, next) => {

  try {
    const userId = req.params.userId;
    //console.log(userId);
    const user = await checkUserExists(userId);
    console.log(user.Voiture);
    const car =await Voiture.findById(user.voiture._id)
    if(!car){
      const error = new Error('Cette voiture n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    //console.log(car.marque);
    car.marque=req.body.marque;
    car.modele=req.body.modele;
    car.couleur=req.body.couleur;
    car.plaque=req.body.plaque;

    const result = await car.save()
    res.status(200).json(result);
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