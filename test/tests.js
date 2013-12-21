var expect = require('expect.js');

var MongoStore = require('../');
var getDb = require('mongo-getdb');
getDb.init('default', 'mongodb://localhost/test_brute_express_mongo');

var mongoStore, collection;

describe('MongoStore', function () {
  before(function (done) {
    mongoStore = new MongoStore(function (callback) {
      getDb(function (db) {
        collection = db.collection('api_limits');
        collection.remove({}, function () {
          callback(collection);
          done();
        });
      });
    });
  });

  it('should be able to set a value', function (done) {
    mongoStore.set('foo', {bar:123}, 1000, function (err) {
      if (err) return done(err);
      collection.findOne({_id: 'foo'}, function (err, limit) {
        if (err) return done(err);
        expect(limit.data).have.property('bar');
        expect(limit.expires).to.be.a(Date);
        done();
      });
    });
  });

  it('should be able to get a value', function (done) {
    mongoStore.set('foo', {bar:123}, 1000, function (err) {
      if (err) return done(err);
      mongoStore.get('foo', function (err, data) {
        if (err) return done(err);
        expect(data).have.property('bar');
        done();
      });
    });
  });


  it('should be able to reset', function (done) {
    mongoStore.set('foo', {bar:123}, 1000, function (err) {
      if (err) return done(err);
      mongoStore.reset('foo', function (err) {
        if (err) return done(err);

        collection.findOne({_id: 'foo'}, function (err, limit) {
          if (err) return done(err);
          expect(limit).to.be(null);
          done();
        });
      });
    });
  });

});