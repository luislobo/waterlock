/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: require('waterlock').models.basicUser.attributes({
    
    /* e.g.
    nickname: 'string'
    */
    
  }),
  
  beforeCreate: require('waterlock').models.basicUser.beforeCreate,
  beforeUpdate: require('waterlock').models.basicUser.beforeUpdate
};
