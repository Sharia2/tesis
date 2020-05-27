var express = require('express');
const bodyParser = require('body-parser')
var app = express();

const MongoClient = require('mongodb').MongoClient
const uri ='mongodb+srv://sara-tesis:sar40rom45@tesis-qfte4.mongodb.net/test?retryWrites=true&w=majority'

let db;
MongoClient.connect(uri, function (err, client) {
    if (err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
    }else{
    console.log('Connected...');
    }
    db = client.db("datos");
    // perform actions on the collection object
    
});

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/medicion', (req, res) => {
    db.collection('mediciones').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.send('dato guardado')
    })
})

app.listen(3000, function () {
    console.log('servidor iniciado 3000!');
});