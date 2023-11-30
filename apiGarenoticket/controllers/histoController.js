const Histo = require('../models/historique');
const Facture = require('../models/facture');

exports.getHistorique = async (req, res, next) => {
  const userId = req.user.userId;
  console.log('userId', userId)
  try {
    const histo = await Histo
    .find({ userId: userId })
    .sort({ createdAt: -1 });
    if (!histo) {
      const error = new Error('Aucun historique trouvé.');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      histo: histo
    });
  } catch (err) {
    next(err);
  }
}

exports.effectuerPaiement = async (req, res, next) => {
  const userId = req.user.userId;
  var montant=0;

  try {
  const histo = await Histo
  .find({ userId: userId });

  if (!histo) {
    const error = new Error('Aucun historique trouvé.');
    error.statusCode = 404;
    throw error;
  }

  for(var hist of histo){

    if(!hist.isPaid){

      montant+=hist.price;
      hist.isPaid=true;
      await hist.save();
      
    }
    
  }

  if(montant===0){
    const error = new Error('Vous n\'avez aucun payement à effectuer');
    error.statusCode = 404;
    throw error;
  }

  const facture = new Facture({
    userId:userId,
    price:montant
  })

  facture.save()
  .then(result => {
    res.status(200).json({ message: "Paiement effectué", facture: facture });
  })
  .catch(err => {
    next(err);
  });

  } catch (err) {
    next(err)
  }  

  }

  exports.getFacture = async (req, res, next) => {
  const userId = req.user.userId;



  try {

    //const user = await checkUserExists(userId);
    const factures = await Facture.find({userId:userId});

    res.json({
      factures: factures
    });
    
  } catch (error) {
    next(error)
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

