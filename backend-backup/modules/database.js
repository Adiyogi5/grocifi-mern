const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
mongoose.Promise = global.Promise;

mongoose.connect(
        process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAlive: true,
            poolSize: 10,
            family: 4,
            useCreateIndex: true,
            useFindAndModify: false,
        })
    .then(() => console.log(`Database connected with app.`))
    .catch((error) => console.log(error));

module.exports = mongoose;