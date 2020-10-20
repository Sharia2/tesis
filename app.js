var express = require('express');
const bodyParser = require('body-parser');
const { restart } = require('nodemon');
var app = express();

const MongoClient = require('mongodb').MongoClient
const uri ='mongodb+srv://sara-tesis:sar40rom45@tesis-qfte4.mongodb.net/test?retryWrites=true&w=majority'
const PORT = process.env.PORT || 3000

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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/medicion', (req, res) => {
    console.log(req.body);
    const obj1 = JSON.parse(Object.keys(req.body)[0]);
    const  {f:fecha, id, tc: temperaturaCorporal, ta: temperaturaAmbiente, h:humedad, la:latitud, lae:hemisferioLatitud, lo:longitud, loe:hemisferioLongitud} = obj1 ;
    const final = { fecha, id, temperaturaCorporal, temperaturaAmbiente, humedad, latitud, hemisferioLatitud,longitud,hemisferioLongitud};
    db.listCollections().toArray().then(collectionsInfo => {
        const collections = collectionsInfo.map(collection => collection.name)
        if (collections.includes(id)) {
            res.send("Primer camino")
            db.collection(`${id}`).insertOne(final, (err, result) => {
                if (err) return console.log(err)
                res.send('dato guardado en coleccion existente')
            })
        } else {
            db.createCollection(`${id}`).then( () => {
                db.collection(`${id}`).insertOne(final, (err, result) => {
                    if (err) return console.log(err)
                    res.send('dato guardado en coleccion nueva')
                })
            } )
        }
    });
    });

app.get('/medicion', (req, res) => {
    db.listCollections().toArray().then(collectionsInfo => {
    const collections = collectionsInfo.map(collection => collection.name)
    const result = {};
    let count = 0; 
    collections.forEach(async (collection, index, array) => {
        const data = await db.collection(collection).find({}).toArray()        
        result[collection] = data;
        count++ 
        if(array.length  === count ){
            res.send(JSON.stringify(result));
        }
    });
    });
} );

app.listen(PORT, function () {
    console.log('servidor iniciado 3000!');
}); 

