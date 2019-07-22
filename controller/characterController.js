const {validationResult} = require('express-validator');
const Character = require('../model/characters');

//random between
const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * ( max - min + 1 ) + min );
};

const characterRules = {
  fighter: ['sword', 'spear', 'axe'],
  archer: ['bow', 'crossbow', 'dagger'],
  wizard: ['staff', 'wand']
};

module.exports = {

  index: (req, res) => {
    let userId = req.session.passport.user;
    Character.find({userId: userId}, (err, characters)=> {
      if(err) return res.send(500, 'Not found');
      return res.render(
        'characters',
        {
          title: 'characters',
          characters: characters,
          userId: userId,
        }
      )
    });

  },

  store: (req, res) => {

    //Validation
    let errors = validationResult(req);
    if(errors && errors.array().length){
      // res.locals.errors = errors.array();
      req.flash('errors', errors.array());
      return res.redirect('/characters')
    }

    const userID = req.session.passport.user;

    //check limit character create
    Character.countDocuments( {userId: userID },(err, count) => {
      if(err) return res.send(500, 'Not found');
      if(count >= 3){
        req.flash('error_msg', 'Create denied (max 3)');
        return res.redirect('/characters');
      }

      const totalPoint = 20;
      let strength = getRandomArbitrary(1, totalPoint-2);
      let agility = getRandomArbitrary(1, totalPoint-1-strength);
      let knowledge = totalPoint - strength - agility;

      if(!characterRules[req.body.class] || !characterRules[req.body.class].includes(req.body.weapon)) {

        req.flash('error_msg', `Class ${req.body.class} cannot use ${req.body.weapon}`);
        return res.redirect('/characters');
      }

      let obj = {
        name: req.body.name,
        class: req.body.class,
        weapon: req.body.weapon,
        userId: userID,
        strength: strength,
        agility: agility,
        knowledge: knowledge,
      };

      let character = new Character(obj);
      character.save(function (err) {
        if (err) return res.send(500, 'Not found');
        req.flash('success_msg', 'Create character success');
        return res.redirect('/characters');
      });

    });

  },

  detail: (req, res) => {

    const id = req.params.id;
    Character.findById(id, (err, character)=> {
      if(err) return res.send(500, 'Not found');
      return res.render('characters/detail', {character: character});
    })

  },

  update: (req, res) => {

    //Validation
    let errors = validationResult(req);
    if(errors && errors.array().length){
      req.flash('errors', errors.array());
      return res.redirect('/characters')
    }

    const id = req.params.id;
    const userId = req.session.passport.user;

    Character.findOne({_id: id, userId: userId}, (err, character)=> {

      if(!characterRules[character.class] || !characterRules[character.class].includes(req.body.weapon)) {

        req.flash('error_msg', `Class ${character.class} cannot use ${req.body.weapon}`);
        return res.redirect(`/characters/${id}`);
      }

      character.weapon = req.body.weapon;
      character.save(function (err) {
        if (err) return res.send(500, 'Not found');
        req.flash('success_msg', 'Update success');
        return res.redirect(`/characters/${id}`);
      })
    })

  },

  delete: (req, res) => {

    const userId = req.session.passport.user;
    const id = req.params.id;
    Character.findOneAndRemove({_id: id, userId: userId}, (err, docs) => {
      // if (err) return res.status(500).send(err);
      if(err) return res.send(500, 'Not found');
      console.log(docs);
      req.flash('success_msg', 'Remove success');
      return res.redirect(`/characters`);

    })
  }

};