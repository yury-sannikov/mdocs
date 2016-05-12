'use strict';
const pug = require('pug');
const Promise = require('bluebird');

const mailgun = require('mailgun-js')({
  apiKey: 'key-3a14af01b2a40eeec8630cf86cc0da26',
  domain: 'app.mdocs.co'});

const ROOT_PATH = './resources/reviewRequest';

exports.sendReviewRequest = function* (to, data) {
  var logoPng = `${ROOT_PATH}/logo.png`;
  var starsPng = `${ROOT_PATH}/stars.png`;
  
  var html = pug.renderFile(`${ROOT_PATH}/index.pug`, data);
  
  var message = {
    from: 'MDOCS Survey <survey@app.mdocs.co>',
    to: to,
    subject: `Quick Patient Survey`,
    html: html,
    inline: [logoPng, starsPng]
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};
