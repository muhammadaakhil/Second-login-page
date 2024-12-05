const express = require('express');
const session = require('express-session');
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const user = express.Router();



user.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home');
    } else {
        if (req.session.passwordwrong) {
            res.render('login', { message: 'Invalid Email or Password'});
            req.session.passwordwrong = false
        } else {
            res.render('login');
        }
    }
})


user.post('/verify', async (req, res) => {
    console.log(req.body);
    const database = client.db('Secondloginpage');
    const signup = database.collection('signup');
    const wheresign = await signup.findOne({email:req.body.username,password:req.body.password})
    // console.log(wheresign)
    if (!wheresign) { 
        req.session.passwordwrong = true;
        res.redirect('/');
    } else {
        req.session.user = req.body.username; 
        res.redirect('/home');
    }
    const user = database.collection('user');
    user.insertOne(req.body)
        .then(result => {
            console.log('Document inserted:', result);
        })
        .catch(error => {
            console.error('Error inserting document:', error);
        });

})


user.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home')
    } else {
        if (req.session.passwordwrong) {
            res.render('login', { message: 'Invalid Email or Password'});
            req.session.passwordwrong = false
        } else {
            res.render('login')
        }
    }
})


user.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
});


user.post("/product", (req, res) => {
    console.log(req.body)
    const database = client.db('Secondloginpage');
    const product = database.collection('product');
    product.insertOne(req.body)
        .then(result => {
            console.log('Document inserted:', result);
        })
        .catch(error => {
            console.error('Error inserting document:', error);
        });
})

user.post('/delete', (req, res) => {
    res.status(200)
    console.log(req.body)
})



user.get('/finddata', async (req, res) => {
    try {
        const database = client.db('Secondloginpage');
        const product = database.collection('product');
        const findresult = product.find({})
        const cursor = await findresult.toArray();
        res.json(cursor);
        console.log(cursor);
    } catch (error) {
        console.log('Error finding data:', error);
        res.status(500).send({ error: 'Failed to retrieve data' });
    }
});

user.get('/findproduct', (req, res) => {
    if(req.session.user){
        res.render('finddata')
    }else{
        res.render('login')
    }
})

user.get('/signup', (req, res) => {
    res.render('signup'); 
});

user.post('/signaction', (req, res) => {
    console.log(req.body)
    const database = client.db('Secondloginpage');
    const signup = database.collection('signup');
    signup.insertOne(req.body)
        .then(result => {
            console.log('Document inserted:', result);
        })
        .catch(error => {
            console.error('Error inserting document:', error);
        });
})


module.exports = user 