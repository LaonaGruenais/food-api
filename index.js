require('dotenv').config()

console.log(process.env.JWT_SECRET)

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// On importe le middleware chargé d'enregistrer les appels d'API
const loggerMiddleware = require('./middlewares/logger')
const app = express()

// Autoriser les requêtes depuis le dront React
app.use(cors())

app.use(loggerMiddleware)

/* on définit le port d'écoute */
const port = process.env.PORT

// Utilisation de Express pour utiliser le body des requêtes
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const router = express.Router()

// Chaîne de connexion à la base de données MongoDB
const mongoDbConnectionsString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(mongoDbConnectionsString, null, error => {
  if (error) throw Error
})

// Récupération de la connexion
const db = mongoose.connection
// Listener de connexion pour valider la connexion
db.once('open', () => {
  console.info('Connexion à la base : OK')
})

/* Route '/' en GET */
/* req = request */
/* res = response */
app.get('/', (req, res) => {
  res.send('Coucou')
})

// Utilisation du router Express
app.use(router)

// Déclaration des routes principales
app.use('/countries', require('./routes/countries'))

app.use('/restaurants', require('./routes/restaurants'))

app.use('/auth', require('./routes/users/auth'))

app.use('/me', require('./routes/users'))

app.use('/dishes', require('./routes/dishes'))

/* lancement du server */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
