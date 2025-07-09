require("dotenv").config();
require('./src/database/connect');
const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const passport = require('passport')
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const app = express();

const origin =  process.env.CLIENT_BASEURL ? process.env.CLIENT_BASEURL.split(',') : "*"

console.log("origin", origin)
app.use(cookieParser(process.env.ENCRYPTION_KEY)); 
app.use(cors({
    origin:origin,
    credentials: true,
}));
app.use(express.json({ type: "application/json", limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser()); // secure: false, domain: undefined 

app.use("/uploads", express.static('public/uploads'));
app.all("/uploads/*", (req, res) => res.sendFile(path.resolve(__dirname, './public/uploads/img-not-found.png')));

app.get("/", async (req, res) => res.json({ status: true, message: "Api Working fine..!!" }));
app.use('/api-v1/', require('./src/routes/index.routes'));
app.use("/front/", require("./src/routes/front/index.routes"));

// Listen both http & https ports
const PORT = parseInt(process.env.PORT) || 9000;
let httpServer = http.createServer(app);

if (process.env.IS_HTTPS === 'true') {
    httpServer = https.createServer({
        key: fs.readFileSync(process.env.CERTIFICATE_KEY_FILE_PATH),
        cert: fs.readFileSync(process.env.CERTIFICATE_FILE_PATH),
        ca: fs.readFileSync(process.env.CERTIFICATE_BUNDLE_FILE_PATH),
    }, app).listen(PORT, () => console.log(`https Server is running on port ${PORT}.`));
} else {
    httpServer.listen(PORT, () => console.log(`http Server is running on port ${PORT}.`));
}

