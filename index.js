const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blog')(router);
const bodyparser = require('body-parser');
const cors = require('cors');
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could not Connect To Database: ', err);
    } else {
        console.log('Connected To Database: ' + config.db);
    }
});
//MiddleW
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);
//
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})