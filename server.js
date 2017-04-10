const express = require("express");
const app = express();
// webpack
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");

const compiler = webpack({
    output: { path: '/public' }
});

app.use(webpackDevMiddleware(compiler, {
    publicPath: '/public'
}));

app.set('post', process.ENV.post || 3000);
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.use('/:page', (req, res, next) => {
  res.render(req.params.page);
});

app.use((req, res, next, err) => {
  if (err) {
    res.status(500);
    console.log(err);
  }
});

app.listen(app.get('port'), (req, res) => {
  console.log("Server is running on port " + app.get('port'));
});
