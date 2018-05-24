const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');


const posts = [];
const pageSize = 5;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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

app.post('/test',function (req, res) {

    res.send({"name":"kate", "email":"jjj@dfsf.com"})
})

app.post('/ypSearchResult', function (req, res) {
    var whatTerm = req.body.what || "kapper";
    request
        .post('https://www.detelefoongids.nl/v1/rest/api/ypSearchResult')
        .send({
            "what" : whatTerm,
            "whereTerm": {"where": "Amsterdam" }
            ,
            "sortBy": "relevance",
            "limit": 100,
            "startIndex": 0,
            "page":1,
            "skip":0,
            "originPath":"hovenier/colmschate/3-1/"
        })
        .end(function (err, response) {
            res.json(response.body);
        });
});

app.get('/', (req, res) => {
  let currentPage = 1;
  const totalPosts = posts.length;
  const pageCount = Math.ceil(totalPosts / pageSize);
  
  if(req.query.page) {
    currentPage = parseInt(req.query.page, 10);
  }
  
  const start = (currentPage - 1) * pageSize;
  const end = currentPage * pageSize;
	
  res.render('index',
    {
	  posts: posts.slice(start, end),
	  pageSize: pageSize,
	  pageCount: pageCount,
	  currentPage: currentPage,
    }
  );
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});