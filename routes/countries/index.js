const router = require('express').Router()

const request = require('request')

router.route('/') // correspond à /restaurants
  .get((req, res) => {
    /* chargement de la liste des pays depuis un fichier */
    const countries = require('../../data/countries-FR.json')
    /* envoi de la liste en réponde */
    res.status(200).send(countries)
  })

router.route('/cities') // correspond à /countries/cities
  .post((req, res) => {
    /* récupérer le pays depuis les paramètres de la requête */
    const body = req.body
    const country = body.country
    // Vérificaiton du paramètre à la requête

    if (!country) {
      return res.status(500).send('Country is missing')
    } else {
      /* récupérer la liste des villes en fonction du pays passé en paramètre */

      // récupérer la liste des villes en fonction du pays passé en paramètre
      // préparation de la requête
      const options = {
        method: 'POST',
        url: `${process.env.COUNTRIES_NOW_API_URL}/countries/cities`,
        headers: {
          'Content-Type': 'application/json'
        },
        // Intégration du paramètre depuis notre requête initilae
        body: JSON.stringify({
          country: country
        })

      }
      // exécution de la requête vers l'API externe countriesnow
      request(options, function (error, response) {
      // traitement d'une éventuelle erreur
        if (error) throw new Error(error)
        // Vérifications des données reçues (transformation au format JSON)
        const body = JSON.parse(response.body)
        console.log(response.body)
        if (body && body.data && !body.error) {
        // Envoyer la liste des villes en réponse
          return res.send(body.data)
        } else {
        // Erreur de données
          res.status(500).send('Erreur lors de la récupération de la liste des villes')
        }
      })
    }
  })

module.exports = router
