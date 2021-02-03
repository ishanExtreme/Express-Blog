const express = require('express');

const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(express.static('public'));
const expressSession = require('express-session');
app.use(expressSession({
    secret: 'keyboard cat'
}))
let port = process.env.PORT;
if (port == null || port == "") {
port = 4000;
}

app.listen(port, ()=>{
    console.log('App listening...')
})
    

global.loggedIn = null;

const flash = require('connect-flash');
app.use(flash());
    

// Ignore**
app.get('/about', (req, res)=> {
    // res.sendFile(path.resolve('pages/about.html'))
    res.render('about');
});

app.get('/contact', (req, res)=> {
    // res.sendFile(path.resolve('pages/contact.html'))
    res.render('contact');
});
// Ignore**

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://username:pass@cluster0.nq86q.mongodb.net/my_database?retryWrites=true&w=majority', {useNewUrlParser: true})

// is a two-level route and can ’ t reference the
// required static files for e.g. in header.ejs
const newPostController = require('./controllers/newPost');
const  authMiddleware = require('./middleware/authMiddleWare')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')

app.get('/posts/new',authMiddleware ,newPostController)

app.use(express.json());
app.use(express.urlencoded());

const filUpload = require('express-fileupload');
app.use(filUpload());


// Custom Middleware
const validateMiddleware = require("./middleware/validationMiddleWare");
app.use('/posts/store', validateMiddleware)


const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPosts');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    console.log(loggedIn)
    next()
});

app.get('/',homeController)
app.get('/post/:id',getPostController)
app.post('/posts/store',authMiddleware ,storePostController)
app.get('/auth/register',redirectIfAuthenticatedMiddleware ,newUserController)
app.post('/users/register',redirectIfAuthenticatedMiddleware ,storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware,loginController)
app.post('/users/login', redirectIfAuthenticatedMiddleware,loginUserController)
app.get('/auth/logout', logoutController)
app.use((req, res)=>{
    res.render('notfound')
})
