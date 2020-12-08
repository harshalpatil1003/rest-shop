const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoose = require("mongoose");


mongoose.connect(
    "mongodb://rest-shop:<password>@cluster0-shard-00-00.2mate.mongodb.net:27017,cluster0-shard-00-01.2mate.mongodb.net:27017,
    cluster0-shard-00-02.2mate.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-5sj2qv-shard-0&authSource=admin&retryWrites=true&w=majority");


const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With,Content-Type,Accept,Authorization");

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});

    }

    next();

});




app.use('/harshal',(req,res,next)=>{
    fs.readFile('./timer.html', function (err, html) {
        if (err) throw err;  
        
            res.writeHeader(200, {"Content-Type": "text/html"});  
            res.write(html);  
            res.end();  
       
    });
});




app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});



app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({

        error: {
            message : error.message
        }


    });


});


module.exports = app;
