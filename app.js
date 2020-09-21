var express = require('express');
const bodyParser = require('body-parser')
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
    db.collection('mediciones').insertOne(final, (err, result) => {
        if (err) return console.log(err)        
        console.log('saved to database')
        res.send('dato guardado')
    })
});

app.get('/medicion', (req, res) => {
    db.collection('mediciones').find({}).toArray().then(data=>{
        res.send(JSON.stringify(data));
    })
} );

app.listen(PORT, function () {
    console.log('servidor iniciado 3000!');
}); 

