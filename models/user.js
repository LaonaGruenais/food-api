// Import des librairies
const mongoose = require('mongoose')
const { Schema } = mongoose

const bcrypt = require('bcryptjs')

// (Champs requis : email + password) Déclaration du schéma
const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    // valider le format d'une chaîne de caractère
    match: /.+\@.+\..+/,
    // pour sécuriser l'adresse mail qu'elle soit noté une seule fois
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  // (Champs optionnels : firstnName, lastName, phone)
  firstName: {
    type: String
    // required: false pas obligé de la mettre car par défaut est déjà à faux
  },
  lastName: {
    type: String
    // required: false
  },
  phone: {
    type: String
    // required: false
  }
}, { timestamps: true })

// On cryptre le mot de passe pour qu'il n'apparaisse pas en clair dans la base de données
// Méthode appelée à chaque enregistrement de l'utilisateur
UserSchema.pre('save', function (next) {
  // this = user car la fonction save est appelée sur le User dans notre code
  const user = this
  // Si le mot de passe a été modifié ou si l'utilisateur est nouveau
  if (this.isModified('password') || this.isNew) {
    // Génération du 'sel' nécessaire pour le cryptage du mot de passe
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error)
      // Cryptage (hashage) du mot de passe
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error)
        // On remplace le mot de passe par le hash
        user.password = hash
        // On passe à la suite
        return next()
      })
    })
  }
})

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (error, isMatch) => {
    if (error) return callback(error)
    callback(null, isMatch)
  })
}

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
