const express = require('express');
const bodyParser = require('body-parser');
/*
  ENTER YOUR COUCHDB USERAME AND PASSWORD INTO THE STRING, FOR EXAMPLE admin:admin
 */
const nano = require('nano')('http://admin:admin@localhost:5984');
var cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async function (req, res) {
  const dblist = await nano.db.list();
  console.log('db list: ', dblist);

  return res.status(201).json(dblist);
});

app.post('/create', async function (req, res) {
  console.log('called /create');
  console.log(req.body);
  try {
    nano.db.create(req.body.name);
    return res.status(201).json('Successfully created db');
  } catch (err) {
    console.log('error creating db: '.err);
    return res.status(400).json('Bad request');
  }
});

app.get('/delete', function (req, res) {
  try {
    res.send('deleted db');
    nano.db.destroy('user_settings');
  } catch (err) {
    console.log('caught error: ', err);
  }
});

app.post('/add', async function (req, res) {
  try {
    console.log('recieved the following to add');
    console.log(req.body);
    //use the user settings database
    const theDb = nano.use('user_settings');

    try {
      //get the doc that we want to update instead of making another
      const jsonDocToUpdate = await theDb.get('details');
      //the _rev is what we need so that couch knows we want to overwite this existing doc
      var objectsIdentfier = jsonDocToUpdate._rev;

      //if we have get the details doc then we update
      await theDb.insert(
        //we have to include the object indetifier (AKA- the _rev) in the instert
        { settings: req.body, _rev: objectsIdentfier },
        'details',
        function (err, response) {
          if (!err) {
            console.log('it worked, update complete');
          } else {
            console.log('update failed: ', err);
          }
        }
      );
    } catch (err) {
      console.log('could not find doc');

      //we insert for the first time as we have not got the details doc
      await theDb.insert(
        //we set the doc id to details
        { settings: req.body },
        'details',
        function (err, response) {
          if (!err) {
            console.log('it worked, insert complete');
          } else {
            console.log('insert failed: ', err);
          }
        }
      );
    }

    return res.status(201).json(req.body);
  } catch (err) {
    console.log('caught error: ', err);
  }
});

app.get('/getData', async function (req, res) {
  try {
    const theDb = nano.use('user_settings');

    /*
    THIS COMMENTED OUT METHOD WILL USE A MANGO QUERY TO GET THE DOCS AND GET THE LATEST DOC
     */

    // //this is a mango query, it will get all the records
    // //this gets all because the selector checks the id is not null
    // //it also filters out the fileds that we are looking for
    // const q = {
    //   selector: {
    //     _id: { $gte: null },
    //   },
    //   fields: ['settings'],
    // };
    // const data = await theDb.find(q);
    // //data holds an object, what we want is the docs property, it holds the array of results and the latest can be found at the most recent index
    // //thats why we use length -1

    // if (data.docs) {
    //   return res.status(201).json(data.docs[data.docs.length - 1]?.settings);
    // }
    // return res.status(201).json({});

    const doc = await theDb?.get('details');
    if (doc) {
      if (doc.settings) {
        return res.status(201).json(doc.settings);
      }
    }
  } catch (err) {
    console.log('Caught error while getting details: ');
    return res.status(400).json('Bad request');
  }
});

app.listen(8000, function () {
  console.log('server listening');
});
