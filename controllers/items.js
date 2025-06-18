const item = require('../models/item');

const NotEnoughRightsError = require('../errors/NotEnoughRightsError');

module.exports.getItems = (req, res, next) => {
  item.find({ owner: `${req.user._id}` })
    .then((items) => res.send(items))
    .catch((err) => next(err));
};

module.exports.deleteItem = (req, res, next) => {
  item.findById(req.params.itemId).orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new NotEnoughRightsError('Нельзя удалять данные другого пользователя');
      }
    })
    .then(() => {
      return item.findByIdAndRemove(req.params.itemId).orFail()
        .then(() => res.send({ message: 'Выбранные данные успешно удалены!' }));
    })
    .catch((err) => next(err));
};

module.exports.createItem = (req, res, next) => {
  console.log(req.body);
  const {
    data, discription, value, category, type,
  } = req.body;
  item.create({
    data, discription, value, category, type,
    owner: req.user._id,
  })
    .then((item) => res.send(item))
    .catch((err) => next(err));
};
