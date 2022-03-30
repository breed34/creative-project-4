const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const fs = require('fs');
const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/pixdesign', {
  useNewUrlParser: true
});

const imageSchema = new mongoose.Schema({
  name: String,
  path: String,
})

const collectionSchema = new mongoose.Schema({
  name: String,
  creator: String,
  images: [imageSchema],
});

const Image = mongoose.model('Image', imageSchema);
const Collection = mongoose.model('Collection', collectionSchema);

app.post('/api/imagelib', async (req, res) => {
  console.log("Saving " + req.body.fileName);
  var fullPath = "/images" + req.body.filePath;
  try {
    await fs.mkdirSync(fullPath, { recursive: true }, (err) => { if (err) console.log(err); });
    await fs.writeFileSync(fullPath + req.body.fileName, req.body.fileData, {encoding: 'base64'}, function (err) {
      console.log(err);
    }
  }
  catch (error) {
    console.log(error);
  }
  });
});

app.delete('/api/imagelib/images/:creator/:collection/:fileName', async (req, res) => {
  var fullPath = "/images/" + req.params.creator + '/' + req.params.collection + '/' + req.params.fileName;;
  console.log(fullPath);
  try {
    await fs.unlinkSync(fullPath);
    res.sendStatus(200);
  }
  catch(err) {
    console.log(err);
  }
});

// Save image to collection
app.post('/api/pixdesign', async (req, res) => {
  console.log("In save to collection");
  try {
    const image = new Image({
      name: req.body.imageName,
      path: "/images" + req.body.imagePath,
    })
    let collection = await Collection.findOne({
      name: req.body.collectionName,
      creator: req.body.collectionCreator
    });
    if (collection == null) {
      collection = new Collection({
        name: req.body.collectionName,
        creator: req.body.collectionCreator,
        images: [],
      })
      console.log("Created collection: " + collection.name);
    }
    collection.images.push(image);
    console.log("Added " + image.name + " to " + collection.name);
    collection.save();
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/pixdesign', async (req, res) => {
  try {
    let collections = await Collection.find();
    res.send(collections);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/pixdesign/:id', async (req, res) => {
  try {
    let collection = await Collection.findOne({_id: req.params.id});
    res.send(collection);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/pixdesign/:id', async (req, res) => {
  try {
      let collection = await Collection.findOne({_id: req.params.id});
      collection.name = req.body.name;
      collection.images = req.body.images;
      collection.save();
      res.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/pixdesign/:collectionId/:imageId', async (req, res) => {
  try {
    let collection = await Collection.findOne({_id: req.params.collectionId});
    collection.images.pull({_id: req.params.imageId});
    collection.save();
    res.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.delete('/api/pixdesign/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    await Collection.deleteOne({_id: req.params.id});
    res.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.listen(3085, () => console.log('Server listening on port 3085!'));
