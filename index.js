// Config API
const express = require('express')
const app = express()
const port = 2020

// Agar dapat menerima object saat post (req.body)
app.use(express.json())

// Config MongoDB
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const URL = 'mongodb://127.0.0.1:27017'
const database = 'API-DB-SimpleMarket'

MongoClient.connect(URL, {useNewUrlParser : true, useUnifiedTopology: true}, (err, client) => {
    // untuk pengecekan koneksi db bisa menggunakan seperti ini
    // err berfungsi untuk menyimpan object error yang akan menampilkan pesan error
    if (err) {
        return console.log(err);
    }
    // atau sepertu ini
    // Ternary
    // err ? console.log(err) : console.log('Success');

    const db = client.db(database)

    app.get('/', (req, res)=>{
        res.send(
            '<h1>Welcome to Simple Market API</h1>'
        )
    })
    
    app.post('/user', (req, res)=>{
        const {name, age} = req.body

        // Cara insert ke databse dengan API
        db.collection('user').insertOne({name, age})
            .then((respon)=>{
                res.send({
                    idNewUser : respon.insertedId,
                    dataUser : respon.ops[0]
                })
            })
    })

    // Get Data berdasarkan nama
    app.get('/user', (req, res)=>{
        var {name} = req.query

        db.collection('user').find({name :name }).toArray()
            .then((respon)=>{
                res.send({
                    respon
                })

                // Customized Response
                // if (respon.length == 0) {
                //     res.send ({
                //         errorMassage : "user Tidak ditemukan"
                //     })
                // }
                // else {
                //     res.send({
                //         respon
                //     })
                // }
            })
    })
    
    
    
})




app.listen(port, ()=>{console.log(`API running at port : ${port}`)})
