var AbstractClientStore = require('express-brute/lib/AbstractClientStore');
var xtend = require('xtend');
var moment = require('moment');

var MongoStore = module.exports = function (getCollection, options) {
  AbstractClientStore.apply(this, arguments);
  this.options = xtend({}, MongoStore.defaults, options);
  var self = this;
  getCollection(function (collection) {
    self._collection = collection;
  });
};

MongoStore.prototype = Object.create(AbstractClientStore.prototype);

MongoStore.prototype.set = function (key, value, lifetime, callback) {
  var _id = this.options.prefix+key;
  var expiration = lifetime ? moment().add(lifetime, 'seconds').toDate() : undefined;

  this._collection.update({
    _id: _id
  }, {
    _id: _id,
    data: value,
    expires: expiration
  }, {
    upsert: true
  }, function () {
    if (callback) callback.apply(this, arguments);
  });
};

MongoStore.prototype.get = function (key, callback) {
  var _id = this.options.prefix + key;
  var collection = this._collection;

  collection.findOne({ _id: _id }, function (err, doc) {
    if (err) {
      typeof callback == 'function' && callback(err, null);
    } else {
      var data;
      if (doc && doc.expires < new Date()) {
        collection.remove({ _id: _id }, {w: 0});
        return callback();
      }
      if (doc) {
        data = doc.data;
        data.lastRequest = new Date(data.lastRequest);
        data.firstRequest = new Date(data.firstRequest);
      }
      typeof callback == 'function' && callback(err, data);
    }
  });
};

MongoStore.prototype.reset = function (key, callback) {
  var _id = this.options.prefix+key;
  this._collection.remove({ _id: _id }, function () {
    typeof callback == 'function' && callback.apply(this, arguments);
  });
};

MongoStore.defaults = {
  prefix: ''
};
