const router = require('express').Router()
// Libraire de gestion des tokens
const { generateToken } = require('../../helpers/TokenHelper')

const User = require('../../models/user')

router.route('/register')
  .post((req, res) => {
    const { email, password, firstname, lastname, phone } = req.body

    if (!email || !password) return res.status(500).send('Email or password is missing')

    const user = new User({
      email, password, firstname, lastname, phone
    })

    user.save((error, result) => {
      if (error) return res.status(500).send(error)
      // Supprimer le mot de passe (pour la sécurité), il faut passer le user en objet pour utiliser la méthode delete
      const _user = result.toObject()
      delete _user.password

      // Génération du token
      const payload = {
        id: _user._id
      }
      generateToken(payload, (error, token) => {
        if (error) return res.status(500).send('Error while generaying token')
        // On renvoit l'utilisateur créé et le token
        return res.send({
          user, token
        })
      })
      return res.send(result)
    })
  })

// EXERCICE
// Créer une route /login
// Récupérer les paramètres envoyés (email, password)
// Récupérer l'utilisation (findOne par email)
// Comparer les mots de passes (celui en paramètre et celui stocké dnas l'utilisation récupéré) avec la méthode comparePassword
// Si mot de passe correct, renvoyer en réponse le user

router.route('/login')
  .post((req, res) => {
    const { email, password } = req.body

    // Gestion des erreurs
    if (!email || !password) return res.status(500).send('Email or password is missing')

    User.findOne({ email: email }, (error, user) => {
      if (error || !user) return res.status(403).send('Invalide Credentials')

      user.comparePassword(password, (callback, isMatch) => {
        if (error || !isMatch) return res.status(403).send('Invalide Credentials')

        // Supprimer le mot de passe (pour la sécurité), il faut passer le user en objet pour utiliser la méthode delete
        user = user.toObject()
        delete user.password

        // Si le mdp est correct, on génère un token et on l'envoit
        // Données à stocker dans le token
        const payload = {
          id: user._id
        }
        // Génération du token
        generateToken(payload, (error, token) => {
          if (error) return res.status(500).send('Error while generaying token')
          return res.send({
            user, token
          })
        })
      })
    })
  })

module.exports = router
