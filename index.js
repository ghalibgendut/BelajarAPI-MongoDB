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

MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    // untuk pengecekan koneksi db bisa menggunakan seperti ini
    // err berfungsi untuk menyimpan object error yang akan menampilkan pesan error
    if (err) {
        return console.log(err);
    }
    console.log(`Connected to MongoDB`);

    // atau sepertu ini
    // Ternary
    // err ? console.log(err) : console.log('Success');

    const db = client.db(database)

    app.get('/', (req, res) => {
        res.send(
            '<h1>Welcome to Simple Market API</h1>'
        )
    })


    // Buat 1 User
    app.post('/user', (req, res) => {
        let { name, age } = req.body

        nameCek = parseInt(name)
        ageCek = parseInt(age);

        // Cara insert ke databse dengan API
        if (isNaN(nameCek) && !isNaN(ageCek)) {
            db.collection('user').insertOne({ name, age })
                .then((respon) => {
                    res.send({
                        idNewUser: respon.insertedId,
                        dataUser: respon.ops[0]
                    })
                }).catch((err) => {
                    res.send(err)
                })
        }
        else {
            res.send({
                error_massage: 'Inputan Salah'
            })
        }

    })

    // Get Data berdasarkan nama
    // app.get('/user', (req, res)=>{
    //     var {name} = req.query

    //     db.collection('user').find({name :name }).toArray()
    //         .then((respon)=>{
    //             res.send({
    //                 respon
    //             })

    //             // Customized Response
    //             // if (respon.length == 0) {
    //             //     res.send ({
    //             //         errorMassage : "user Tidak ditemukan"
    //             //     })
    //             // }
    //             // else {
    //             //     res.send({
    //             //         respon
    //             //     })
    //             // }
    //         })
    // })

    // READ ONE USER
    app.get('/findone', (req, res) => {
        // req.query = {age :  "28", nama: "Andri"}

        // Data yang dikirim saat proses GET akan dianggap sebagai string
        let age = parseInt(req.query.age)

        if (!isNaN(age)) { // Jika user input dengan benar

            // Mencari satu data berdasarkan umurnya
            db.collection('user').findOne({ age })
                .then((resp) => { // Jika berhasil menjalankan findOne

                    res.send(resp)

                }).catch((err) => { // Jika terjadi kegagalan proses findOne, masalah server
                    res.send(err)
                })
        } else { // Jika terjadi kesalahan input user
            res.send({
                error_message: "Inputan Anda salah"
            })
        }

    })

    // READ MANY USERS
    app.get('/find', (req, res) => {

        let usia = parseInt(req.query.usia)

        if (!isNaN(usia)) { // Jika user input data dengan benar
            // Mencari lebih dari satu data berdasarkan umurnya
            db.collection('user').find({ age: usia }).toArray()
                .then((resp) => { // Jika berhasil melakukan find
                    res.send(resp)

                }).catch((err) => { // Jika terjadi masalah dengan server, akan mengirim object error

                    res.send(err)

                })

        } else { // Jika terjadi kesalahan input oleh user, makan akan mengirimkan object info

            res.send({
                error_message: "Inputan Anda salah"
            })
        }


    })

    // Get All user
    app.get(`/allUser`, (req, res) => {
        db.collection(`user`).find({}).toArray()
            .then((respon) => {
                res.send(respon)
            })
    })

    // DELETE BY AGE
    app.delete(`/userDeleteAge/:age`, (req, res) => {
        let umur = parseInt(req.params.age)

        db.collection(`user`).deleteOne({ age: umur })
            .then((respon) => {
                res.send(respon)
            })
    })

    // DELETE BY Name
    app.delete(`/userDeleteName/:name`, (req, res) => {
        let name = req.params.name

        name = parseInt(name)

        if (isNaN(name)) { // Jika input user benar
            // Agar karakter pertama pada nama akan menjadi huruf besar (capital)
            name = name[0].toUpperCase() + name.slice(1)

            db.collection('user').deleteOne({ name })
                .then((resp) => { // Jika berhasil menjalankan deleteOne
                    res.send(resp)

                }).catch((err) => { // Jika gagal menjalankan deleteOne
                    res.send(err)

                })

        } else { // Jika terjadi kesalahan input user
            res.send({
                error_message: "Inputan Anda salah"
            })
        }
    })

    // EDIT BY NAME
    app.patch(`/user/:name`, (req, res) => {
        let name = req.params.name // Demian
        let newName = req.body.newname // Deny

        name = parseInt(name)
        newName = parseInt(newName)

        if (isNaN(name) && isNaN(newName)) { // Jika user input data dengan benar

            name = name[0].toUpperCase() + name.slice(1)

            db.collection('user').updateOne({ name }, { $set: { name: newName } })
                .then((resp) => { // Jika berhasil menjalankan updateOne
                    res.send({
                        banyak_data: resp.modifiedCount
                    })
                }).catch((err) => { // Jika gagal menjalankan updateOne
                    res.send(err)
                })
        } else { // Jika terjadi kesalahan input user
            res.send({
                error_message: "Inputan Anda salah"
            })
        }
    })



})




app.listen(port, () => { console.log(`API running at port : ${port}`) })
