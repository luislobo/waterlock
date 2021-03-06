'use strict';

/**
 * [attributes description]
 * @param  {[type]} attributes
 * @return {[type]}
 */
exports.attributes = function(attributes){
  var _ = require('lodash');

  var template = {
    resetToken: 'string',
    expiration: 'datetime',
    owner: {
      model: 'user'
    }
  };

  return _.merge(template, attributes);
};

/**
 * [beforeCreate description]
 * @param  {[type]}   values
 * @param  {Function} cb
 * @return {[type]}
 */
exports.beforeCreate = function(values, cb){
  var moment = require('moment');
  var krypt = require('../waterlock').krypt;

  if(typeof values.resetToken === 'undefined'){
    values.resetToken = krypt.random(13);
  }
  var key = krypt.sha256(values.resetToken);
  values.resetToken = key;

  var expiration = moment().add('hours', 1).format('YYYY-MM-DD HH:mm:ss');
  values.expiration = expiration;

  cb();
};

/**
 * [afterCreate description]
 * @param  {[type]}   token [description]
 * @param  {Function} cb    [description]
 */
exports.afterCreate = function(token, cb){
  var config = require('../waterlock').config;

  if(config.passwordReset.tokens){

    var utils = require('../utils');
    var html = utils.getHtmlEmail(token);


    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: config.passwordReset.mail.from, // sender address
        subject: config.passwordReset.mail.subject, // Subject line
        text: html, // plaintext body
        html: html // html body
    };

    User.findOne(token.owner).done(function(err, u){
      mailOptions.to = u.email;

      var transport = require('../waterlock').transport;
      transport.sendMail(mailOptions, utils.mailCallback);
    });
  }

  cb();
};