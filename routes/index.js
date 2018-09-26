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
      subject: 'The Fix! Weekly Blog Updates from ' + feed.title,
      html: '<div style="text-align: center;"><a href="http://regenexx.com"><img src="https://getregenerative.com/wp-content/uploads/2018/09/newsletter_logo.png" width="500px" align="center"></a><br /><h1 style="color: grey;">This Week\'s Blog Posts from Get Regenerative</h1><h2 style="color: #0b1423d9;">The latest articles, outcomes, news and commentary on regenerative orthopedic medicine.</h2></div><hr />'
    };

    
    for (let index = 0; index < 5; index++) {
      
      const element = feed.items[index];
      
      msg.html += '<h3 style="margin-top: 10px;"><a href="' + element.link + '">' + element.title + '</a></h3><p>' + element.content + '</p><hr />'
      
      console.log(element.title);
      console.log(element.link);
      console.log(element.contentSnippet);
      
    }
    // msg.html will need to be base64 encoded prior to forwarding to Infusionsoft's API
    console.log(msg.html);
    sgMail.send(msg);
    res.render('index', { title: 'Express', output: JSON.stringify(feed)});
  })();
  

});

module.exports = router;
