require('dotenv').load();
var PORT = 8765;
var express = require('express')
var pg = require('pg')
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json({
  limit: '10mb'
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/archive', function(request, result) {
  pg.connect(process.env.PG_CONNECTION, function(err, client, done) {
    if (err) {
      console.error(err)
      result.send('db connection error')
      done()
      return
    }
    client.query('INSERT INTO "Entry" (data) VALUES ($1)', [JSON.stringify(request.body)], function(err, dbresult) {
      if (err) {
        console.error(err)
        result.send('db error')
        done()
        return
      }
      done()
      result.send('success')
    })
  })
})

app.get('/', function(request, result) {
  result.send('coming soon')
})

app.get('/list/:username', function(request, result) {
  pg.connect(process.env.PG_CONNECTION, function(err, client, done) {
    if (err) {
      console.error(err)
      result.send('db connection error')
      done()
      return
    }
    var usernameQuery = JSON.stringify({username: request.params.username});
    var query = client.query('SELECT * FROM  "Entry" WHERE data @> $1', [usernameQuery])
    var results = []
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      done()
      result.json(results);
    });

  })
})

app.listen(PORT ,function() {
  console.log('listening on ' + PORT)
})

