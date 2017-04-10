const express = require("express");
const app = express();
const webpackMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const routes = require('./src/routes');

webpackConfig = {
  entry: "./src/js/index.js",
  output: {
    path: '/src/public/',
    library: "authLibrary"
  }
};

app.use(webpackMiddleware(webpack(webpackConfig), {
  publicPath: "/src/public",
  lazy: true
}));

app.set('port', process.env.port || 3000);
app.use(express.static('src/public'));
app.set('views', "./src/views");
app.set('view engine', 'pug');

app.use('/', routes);

app.listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});
