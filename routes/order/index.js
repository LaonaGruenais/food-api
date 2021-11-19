const router = require('express').Router()
const User = require('../../models/User')
const Order = require('../../models/Order')

router.route('/')
  .post(async (req, res) => {
    const { body } = req
    // On récupère les infos depuis le corps de la requête
    const { user, cart } = body

    if (!user || !cart) return res.status(500).send('Missing data')
    // On test si l'utilisateur existe déjà par son email
    try {
      const userExist = await User.findOne({ email: user.email })
      let orderUser
      if (!userExist) {
        // Si il n'éxiste pas, on créé un user
        const _user = new User({
          email: user.email,
          password: Math.random().toString(36).slice(-8),
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        })
        // on enregistre le user
        orderUser = await _user.save()
      } else {
        // Si il existe, on récupère l'utilisateur existant
        orderUser = userExist
      }

      // On créé une commande en la reliant à l'utilisateur précédemment créé
      const order = new Order({
        user: orderUser._id,
        cart: cart,
        address: user.address
      })
      // On enregistre la commande et on la renvoit en réponse
      const orderSaved = await order.save()
      return res.send(orderSaved)
    } catch (error) {
      return res.status(500).send(error)
    }
  })

module.exports = router
