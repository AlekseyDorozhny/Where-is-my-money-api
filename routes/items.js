const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getItems, deleteItem, createItem,
} = require('../controllers/Items');

router.get('/', getItems);

router.delete(
  '/:ItemId',
  celebrate({
    params: Joi.object().keys({
      ItemId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteItem,
);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({

      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().pattern(/^(http|https):\/\/[^ "]+$/).required(),
      trailerLink: Joi.string().pattern(/^(http|https):\/\/[^ "]+$/).required(),
      thumbnail: Joi.string().pattern(/^(http|https):\/\/[^ "]+$/).required(),
      ItemId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),


      data: Joi.date().required(),
      discription: Joi.string().required(),
      value: Joi.number().required(),
      category: Joi.string().required(),
      type: Joi.string().required(),
    }),
  }),
  createItem,
);

module.exports = router;
