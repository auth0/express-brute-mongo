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
db.my_api_limits_coll.ensureIndex({expires: 1}, {expires: 0});
```

## License

MIT 2013 - Auth10 LLC.

Copyright (c) 2013 Auth10 LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
