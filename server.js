const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shorturl');

mongoose
  .connect('mongodb://localhost/urlshortner', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log('connection is sucasefull');
  })
  .catch((e) => {
    console.log(`connections fall ${e}`);
  });

const app = express();
app.use(express.urlencoded({extended: false}));

const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const shortUrls = await shortUrl.find();
  //console.log(shortUrls);
  res.render('index', {shortUrls: shortUrls});
});

app.post('/shortUrl', async (req, res) => {
  await shortUrl.create({
    full: req.body.fullUrl,
  });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const newshort = await shortUrl.findOne({short: req.params.shortUrl});
  if (newshort == null) {
    res.status(404);
  } else {
    await newshort.click++;
    await newshort.save();
    res.redirect(newshort.full);
  }
});

app.listen(port, (e) => console.log(`surver is running on port ${port}`));
