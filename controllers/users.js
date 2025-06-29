const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ConflictingRequestError = require('../errors/ConflictingRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

module.exports.login = (req, res, next) => {
  console.log('кто-то заходит');

  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: 36000 },
      );
      res.cookie('jwt', token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: false,
        secure: false,
      });
      console.log('отправляю токен');
      console.log(token);
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.sendStatus(200);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password, imageUrl
  } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10)
    .then((hash) => {
      const user = User.create({
        name, email, password: hash, imageUrl
      });
      return user;
    })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      imageUrl: imageUrl
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictingRequestError('Данный Email уже зарегестрирован'));
        return;
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email, imageUrl} = req.body;
  console.log(req.body);
  User.findByIdAndUpdate(
    req.user._id,
    { name, email, imageUrl },
    { new: true, runValidators: true, upsert: false },
  ).orFail()
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictingRequestError('Данный Email уже зарегестрирован'));
        return;
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id).orFail()
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl
    }))
    .catch((err) => next(err));
};
