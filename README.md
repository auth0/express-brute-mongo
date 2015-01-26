MongoDB store adapter for the [express-brute](https://github.com/AdamPflug/express-brute).

## Installation

~~~
npm install express-brute-mongo
~~~

## Usage

~~~javascript
var ExpressBrute = require('express-brute'),
var MongoStore = require('express-brute-mongo');
var MongoClient = require('mongodb').MongoClient;

var store = new MongoStore(function (ready) {
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if (err) throw err;
    ready(db.collection('bruteforce-store'));
  });
});

var bruteforce = new ExpressBrute(store);

app.post('/auth',
  bruteforce.prevent, // error 403 if we hit this route too often
  function (req, res, next) {
    res.send('Success!');
  }
);
~~~

## Expire documents

Create an index with `expireAfterSeconds: 0` in mongo as follows:

```
db.my_api_limits_coll.ensureIndex({expires: 1}, {expireAfterSeconds: 0});
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
