const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const { login, createUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', auth, require('./users'));
router.use('/Items', auth, require('./Items'));

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      imageUrl: Joi.string().pattern(/^(http|https):\/\/[^ "]+$/).required(),
    }),
  }),
  createUser,
);

router.post('/signout', logout);

router.use('*', auth, () => {
  throw new NotFoundError('Страницы не существует');
});

module.exports = router;
