const Historiques = require("../models/historique");
const Factures = require("../models/facture");
const User = require("../models/user");
const Voitures = require("../models/voiture");

const hash = require("../seeds/users");
const factures = require("../seeds/factures");
const historiques = require("../seeds/historique");
const voitures = require("../seeds/voitures");

exports.seed = async (req, res, next) => {
  const result = {};

  const users= await hash()

  try {
    await Promise.all([
      Factures.deleteMany(),
      Historiques.deleteMany(),
      User.deleteMany(),
      Voitures.deleteMany(),
    ]);

    const [usersInsert,  facturesInsert, historiquesInsert,voitureInsert] = await Promise.all([
      User.insertMany(users),
      Factures.insertMany(factures),
      Historiques.insertMany(historiques),
      Voitures.insertMany(voitures),
    ]);

    if (usersInsert.length > 0) {
      result.users = usersInsert;
    }

    if (voitureInsert.length > 0) {
      result.voitures = voitureInsert;
    }

    if (facturesInsert.length > 0) {
      result.factures = facturesInsert;
    }

    if (historiquesInsert.length > 0) {
      result.historiques = historiquesInsert;
    }

    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};