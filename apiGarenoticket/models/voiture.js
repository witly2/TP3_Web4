const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voitureSchema = new Schema(
  {
    marque: {
      type: String,
      required: [true,"échec, pas de marque"],
    },
    modele: {
      type: String,
      required: [true,"échec, pas de modèle"],
    },
    couleur: {
      type: String,
      required: [true,"échec, pas de couleur"],
    },
    plaque: {
      type: String,
      required: [true,"échec, pas de plaque"],
    },
    valet: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isParked: {
      type: Boolean,
      default:false
    },
    isMoving: {
      type: Boolean,
      default:false
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    timeToLeave: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voiture', voitureSchema);
