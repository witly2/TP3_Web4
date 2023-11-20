const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');






exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {

      const user = await User.findOne({email: email});
    
      if(user){
        await bcrypt.compare(password, user.password)
        .then(response => {
          if (response) {

            
              // Création du token
            const token = jwt.sign(
              {
                // Payload
                email: email
              },
             config.SECRET_JWT,
              { expiresIn: '1h' }
            );

            res.status(201).json({token:token});
           
          }

        })
        .catch(err => {
          next(err)
        });
      }
      
      const error = new Error(' Utilisateur Ou mot de passe incorrect');
      error.statusCode = 401;
      throw error;

  } catch (err) {
    next(err)
  }

};

exports.signup = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  try {
    const existUser = await User.findOne({email: email});

    if(existUser){
      const error = new Error('Ce courriel est déjà attribué');
      error.statusCode = 409;
      throw error;
    }

    if(password != confirmPassword){
      const error = new Error('Les mots de passe ne correspondent pas');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
      username: username,
      email:email,
      password:hashedPassword,

    })

    const result = await user.save();

    res.location("/user/" + result.id);

    res.status(201).json(result)

    
  } catch (err) {
    next(err)
  }
};

