const crypto = require('crypto').randomBytes(256).toString('hex');
module.exports = {
    uri: 'mongodb+srv://karim:3TA54nM8DIzBpS8M@cluster0.at63f.mongodb.net/+' + this.db + '?retryWrites=true&w=majority',
    secret: crypto,
    db: 'myFirstDatabase'
}