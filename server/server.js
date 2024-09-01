import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http'
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import require_auth from './Middleware/Auth.js';
config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000


app.use(cors());
app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'build')));

import fileRoute from '../server/Routes/files.js'
import adminRoute from '../server/Routes/admin.js'
import linksRoute from '../server/Routes/getLinks.js'
import shareRoute from '../server/Routes/share.js'
import mysharedRoute from '../server/Routes/myshared.js'
import sharelinksRoute from '../server/Routes/sharelinks.js'
app.use('/files',require_auth, fileRoute);
app.use('/admin', require_auth, adminRoute);
app.use('/getLinks', require_auth, linksRoute);
app.use('/share', require_auth, shareRoute);
app.use('/myshared', require_auth, mysharedRoute)
app.use('/sharelinks', sharelinksRoute)

app.get('/*', function (req, res) {
    console.log('here i am')
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})





app.use(express.urlencoded({extended:false}));

server.listen(port, function () {
    console.log('Server started on port 5000')
})

export default app
