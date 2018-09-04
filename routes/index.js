var express = require('express');
var router = express.Router();
let Parser = require('rss-parser');
let parser = new Parser();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SGMAIL_APIKEY);

/* GET home page. */
router.get('/', function(req, res, next) {

  (async () => {
 
    let feed = await parser.parseURL(process.env.FEED_URL);
    console.log(feed.title);

    const msg = {
      to: process.env.TO_ADDRESS,
      from: process.env.FROM_ADDRESS,
      subject: 'Your Weekly ' + feed.title + ' Blog Update',
      html: '<div style="text-align: center;"><a href="http://regenexx.com"><img src="https://d1yoaun8syyxxt.cloudfront.net/sz324-8f36a4ab-9dc3-4663-a0e4-b059c8d42a73-v2" width="500px" align="center"></a><br /><h1 style="color: grey;">This Week\'s Blog Posts from Regenexx</h1><h2 style="color: #0b1423d9;">The latest articles, outcomes, news and commentary on regenerative orthopedic medicine.</h2></div><hr />'
    };

    
    for (let index = 0; index < 3; index++) {
      
      const element = feed.items[index];
      
      msg.html += '<h3 style="margin-top: 10px;"><a href="' + element.link + '">' + element.title + '</a></h3><p>' + element.content + '</p><hr />'
      
      console.log(element.title);
      console.log(element.link);
      console.log(element.contentSnippet);
      
    }
    console.log(msg.html);
    sgMail.send(msg);
    res.render('index', { title: 'Express', output: JSON.stringify(feed)});
  })();
  

});

module.exports = router;
