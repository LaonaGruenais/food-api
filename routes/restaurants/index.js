const router = require('express').Router()

const Restaurant = require('../../models/Restaurant')

router.route('/') // correspond à /restaurants
// GET lister les éléments (récupérer de la data)
  .get((req, res) => {
    // Récupérer la liste des restaurants depuis MongoDB
    Restaurant.find((error, result) => {
    // Envoi de l'erreur en cas de problème
      if (error) {
        return res.status(500).send('Erreur lors de la récupération des restaurants')
      } else {
        // Envoi de la liste des résultats (restaurants)
        return res.send(result)
      }
    })
  })

// POST (ajouter un élément)
  .post((req, res) => {
    // Extraction des paramètres du corps de la requête
    const { body } = req
    const { name, description, dishes } = body

    // Validation des paramètres du corps de la requête
    if (!name) return res.status(500).send('Name is missing')
    if (!description) return res.status(500).send('Description is missing')

    const restaurant = new Restaurant({
      name: name,
      description: description,
      dishes: dishes
    })

    restaurant.save((error, result) => {
      if (error) return res.status(500).send(error)
      Restaurant.find((error, result) => {
        // Envoi de l'erreur en cas de problème
        if (error) {
          return res.status(500).send('Erreur lors de la récupération des restaurants')
        } else {
          // Envoi de la liste des résultats (restaurants)
          return res.send(result)
        }
      })
    })
  })
  .delete((req, res) => {
    // On a besoin de l'ID de l'élément à supprimer (voir postman)
    const { body } = req
    const { id } = body

    if (!id) return res.status(500).send('ID is missing')

    // Récuparation de l'objet à supprimer + supression
    Restaurant.findByIdAndDelete(id, (error, result) => {
      if (error) return res.status(500).send(error)
      Restaurant.find((error, result) => {
        // Envoi de l'erreur en cas de problème
        if (error) {
          return res.status(500).send('Erreur lors de la récupération des restaurants')
        } else {
          // Envoi de la liste des résultats (restaurants)
          return res.send(result)
        }
      })
    })
    // Bonus, retourner la liste de tt les restaurants
  })

/* ERREUR D ACCOLADES
  // Update
  .patch((req,r  => {
      // On a besoin de l'ID et des infos à modiifer, prend l'objet entier afin d'avoir toutes les propriétés
      const { body: { restaurant } } = req
      // on peut aussi écrire :const { id } = req.body
      if (!restaurant) return res.status(500).send('Restaurant Object is missing')
      // On extrait l'ID
      const id = restaurant._id
      // On verifie l'ID
      if (!id) return res.status(500).send('ID is missing')

      Restaurant.findByIdAndUpdate(id, restaurant, (error, result) => {
        if (error) return res.status(500).send(error)
        Restaurant.find((error, result) => {
          // Envoi de l'erreur en cas de problème
          if (error) {
            return res.status(500).send('Erreur lors de la récupération des restaurants')
          } else {
            // Envoi de la liste des résultats (restaurants)
            return res.send(result)
          }
      })
  })
*/

  .patch((req, res) => {
  // Double extraction, récupération de l'objet entier afin d'avoir toutes ses propriétés
    const { body: { restaurant } } = req

    if (!restaurant) return res.status(500).send('Restaurant Object is missing')

    const id = restaurant._id

    if (!id) return res.status(500).send('Id is missing')

    Restaurant.findByIdAndUpdate(id, restaurant, (error, result) => {
      if (error) return res.status(500).send(error)
      else {
        Restaurant.find((error, result) => {
          if (error) {
            return res.status(500).send(error)
          } else {
            return res.send(result)
          }
        })
      }
    })
  })
module.exports = router
