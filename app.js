const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;
const regAuthLogoutRoutes = require('./routes/reg-auth-logout-routes');
const housingsRoutes = require('./routes/housings-routes');
const fullInfoRoutes = require('./routes/full-info-routes');
const bookingsRoutes = require('./routes/bookings-routes');
const messagesRoutes = require('./routes/messages-routes');
const expressHbs = require("express-handlebars");
const hbs = require("hbs");

app.set('view engine', 'hbs');
app.engine("hbs", expressHbs.engine({
    layoutsDir: "views/layouts",
    defaultLayout: "layout",
    extname: "hbs"
}));

app.use(express.static(__dirname + "/public/"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'secretWord',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const multer = require("multer");
let storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
let upload = multer({ storage: storageConfig });



/*app.use(multer({dest:"uploads"}));*/

app.use(regAuthLogoutRoutes);
app.use(housingsRoutes);
app.use(fullInfoRoutes);
app.use(bookingsRoutes);
app.use(messagesRoutes);

hbs.registerPartials(__dirname + "/views/partials");

app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`)
});