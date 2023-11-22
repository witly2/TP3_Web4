const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true,"échec, pas de courriel"],
      unique: true,
      match: [/.+@.+\..+/, 'Adresse courriel invalide'],
    },
    username: {
      type: String,
      required: [true,"échec, pas de prénom"],
      maxlength: [50, 'Le username doit contenir au plus 50 caractères']
    },
    password: {
      type: String,
      required: [true,"échec, pas de mot de passe"],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    isValet: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0
    },
    voiture: {
      type: Schema.Types.ObjectId,
      ref: 'Voiture',
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);
