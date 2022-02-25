const express = require('express'),
	  path    = require('path'),
	  bodyParser = require('body-parser'),
 	  app 	  = express(),
 	  port 	  = 9001;


app.set('views', path.join(__dirname, '/lib/views'));
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./lib/routes/Routes'));

app.listen(port, () => {
  console.log(`Downloader listening at http://localhost:${port}`)
});