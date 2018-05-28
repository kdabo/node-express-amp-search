const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');
const multer = require('multer');

const app = express();
const multipart = multer();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const public_path = express.static(__dirname + '/public');

app.use(public_path);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("AMP-Access-Control-Allow-Source-Origin", "http://localhost:3000");
    res.header("Content-Type: application/json");
    res.header("Access-Control-Expose-Headers: AMP-Access-Control-Allow-Source-Origin");
    res.header("AMP-Same-Origin: true");
    res.header("Cache-Control: private, no-cache");
    next();
});

app.post('/ypSearchResult', multipart.fields([]), (req, res) => {
    var whatTerm = req.body.what;
    request
        .post('https://www.detelefoongids.nl/v1/rest/api/ypSearchResult')
        .send({
            "what": whatTerm,
            "whereTerm": {"where": "Amsterdam"}
            ,
            "sortBy": "relevance",
            "limit": 100,
            "startIndex": 0,
            "page": 1,
            "skip": 0,
            "originPath": "hovenier/colmschate/3-1/"
        })
        .end(function (err, response) {
            res.json(response.body);
        });
});

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});