/**
 * 1) Créer modèle de Document mongoDB
 * - titre, description, prix, catégorie (énumération) (starter, dish, dessert, boisson)
 * 2) Créer la route d'API
 * -Create, Read, Update, Delete(CRUD) la gestion des plats en utilisant les bonnes méthodes HTTP
 * 3) BONUS : Associer les plats à un ou des restaurants
 */

const router = require('express').Router()

const Dishes = require('../../models/dishes')
const Restaurant = require('../../models/restaurant')

router.route('/')

  .get((req, res) => {
  // Récupération des plats pour 1 restaurant donné
    const id = req.query.id
    if (id) {
      Dishes.find({ restaurant: id }, (error, result) => {
        if (error) return res.send(500).send('Erreur lors de la récupération des plats')
        return res.send(result)
      })
    } else {
      Dishes.find((error, result) => {
        if (error) return res.send(500).send('Erreur lors de la récupération des plats')
        return res.send(result)
      })
    }
  })

  .post((req, res) => {
    const { body } = req
    const { title, description, price, category, restaurant } = body

    if (!title) return res.status(500).send('Title is missing')
    if (!description) return res.status(500).send('Description is missing')
    if (!price) return res.status(500).send('Price is missing')
    if (!category) return res.status(500).send('Category is missing')
    if (!restaurant) return res.status(500).send('Restaurant is missing')

    const dishes = new Dishes({
      title: title,
      description: description,
      price: price,
      category: category,
      restaurant: restaurant
    })

    dishes.save((error, result) => {
      if (error) return res.status(500).send(error)

      // Lien vers le restaurant
      Restaurant.findById(restaurant, (error, resto) => {
        if (error) return res.status(500).send(error)
        // On ajoute le plat dans le restaurant
        resto.dishes.push(dishes)
        // On enregistre le restaurant
        resto.save((error, result) => {
          if (error) return res.status(500).send(error)
          // On envoit la liste des plats
          Dishes.find((error, result) => {
            if (error) {
              return res.status(500).send('Erreur de la récup de la vaisselle')
            } else {
              return res.send(result)
            }
          })
        })
      })
    })
  })

  .delete((req, res) => {
    const { body } = req
    const { id } = body

    if (!id) return res.status(500).send('ID is missing')

    Dishes.findByIdAndDelete(id, (error, result) => {
      if (error) return res.status(500).send(error)
      Dishes.find((error, result) => {
        if (error) {
          return res.status(500).send('Erreur lors de la récupération des dishes')
        } else {
          return res.send(result)
        }
      })
    })
  })

  .patch((req, res) => {
    const { body: { dishes } } = req

    if (!dishes) return res.status(500).send('Dishes Object is missing')

    const { _id } = dishes

    if (!_id) return res.status(500).send('Id is missing')

    Dishes.findByIdAndUpdate(_id, dishes, (error, result) => {
      if (error) return res.status(500).send(error)
      else {
        Dishes.find((error, result) => {
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
