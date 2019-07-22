const {body} = require('express-validator');
const Character = require('../model/characters');

//modify name (special character)
const regex = /^[a-z\d\-_]+$/i;
module.exports = {

  characterValidation: method => {
    switch (method) {
      case 'store': {
        return [
          body('name')
            .not().isEmpty().withMessage('Name character required')
            .isLength({ min: 6, max: 20}).withMessage('Name must be between 6 and 20 chars long')
            .custom(value => {
              if(!regex.test(value)){
                return Promise.reject('Name cannot contain special characters');
              }
              return Character.findByName(value).then(character => {
                if (character) {
                  return Promise.reject('Name is token');
                }
              });
          }),

          body('class').not().isEmpty().withMessage('Class required'),
          body('weapon').not().isEmpty().withMessage('Weapon required'),
        ]
      }
      case 'update': {
        return [
          body('weapon').not().isEmpty().withMessage('Weapon required')
        ]
      }
    }
  }
};
