// EXERCICE
// Un appel d'api qui renvoit l'utilisateur par son ID
// Route : localhost:3000/me
// L'ID est en dur dans une constante (en choirs 1 dans la base de données)
// La fonction retourne l'utilisateur au client

const router = require('express').Router()

const User = require('../../models/User')

const withAuth = require('../../middlewares/authMiddleware')
const { extractIdFromRequestAuthHeader } = require('../../helpers/TokenHelper')

// Récupère et retourne un utilisateur par son ID
router.route('/')
  .get(withAuth, (req, res) => {
    const id = extractIdFromRequestAuthHeader(req)

    /* Méthode callback
    User.findById(id, (error, result) => {
      if (error) {
        return res.status(500).send('Erreur lors de la récupération de l id')
      } else {
        return res.send(result)
      }
    }) */

    // Méthode Promesse en retirant le password des données retournées par mongodb
    User.findById(id).select('-password')
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error))
  })

module.exports = router
