var jwt = require('jsonwebtoken');
var config = require('../config/config');
var request = require('request');
// var admin = require("firebase-admin");
// var speakeasy = require("speakeasy");
var fs = require('fs');
var path = require('path');

module.exports.decryptJWTWithToken = function (token) {
  if (!token) {
    return false;
  }

  // token = token.split("Bearer ")[0]; // If Bearer system is implimented

  var user_credentials = jwt.verify(token, config.jwtKey);
  return user_credentials;
};

module.exports.sendEmail = function (to, subject, message, callback) {
  // console.log("The send grid api key is: ");
  // console.log(config.apiKeys.sendGrid);

  console.log('Sending an email to ');
  console.log(to);
  var options = {
    method: 'POST',
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      authorization: 'Bearer ' + config.apiKeys.sendGrid,
      'content-type': 'application/json',
    },
    body: {
      personalizations: [
        {
          to: [
            {
              email: to.email,
              name: to.name,
            },
          ],
          subject: subject,
        },
      ],
      from: {
        email: 'rgautam9398@gmail.com',
        name: 'Raghavendra Gautam',
      },
      reply_to: {
        email: 'rgautam9398@gmail.com',
        name: 'Raghavendra Gautam',
      },
      subject: subject,
      content: [
        {
          type: 'text/html',
          value: message,
        },
      ],
    },
    json: true,
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
      if (callback) {
        callback(false);
      }
      return;
    }
    console.log('Sending email is a success');
    console.log(body);

    if (callback) {
      callback(true);
    }
  });
};

module.exports.sendSmsFromPredefinedTemplate = function (to, templateName, vars, callback) {
  var form_data = {
    From: config.app.sms.from,
    To: to,
    TemplateName: templateName,
    // All the vars (placeholders in the template) come here.
  };

  for (var i in vars) {
    form_data[i] = vars[i];
  }

  var options = {
    method: 'POST',
    url: 'http://2factor.in/API/V1/' + config.apiKeys.twoFactor + '/ADDON_SERVICES/SEND/TSMS',
    form: form_data,
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log('There was an issue in sending the sms');
      console.log(error);
      return;
      callback(true);
    }

    console.log('Sent the sms');
    console.log(options);

    console.log(body);

    if (callback) {
      callback(null, true);
    }
  });
};

// All about Push notifications

module.exports.publishPushNotificationFCM = function (payload, topic) {
  // Returns promise

  payload.data.topic = topic;
  var message = {
    data: payload.data,
    notification: payload.notification,
    topic: '/topics/' + topic,
  };

  console.log(message);

  console.log('publishing a push notification to firebase FCM');

  return admin.messaging().send(message);
};

module.exports.subscribeToFCMTopic = function (topic, token, callback) {
  // With admin adk: https://firebase.google.com/docs/cloud-messaging/admin/manage-topic-subscriptions

  return admin.messaging().subscribeToTopic([token], '/topics/' + topic); // Returns a promise
};

module.exports.unsubscribeToFCMTopic = function (topic, token, callback) {
  // With admin adk: https://firebase.google.com/docs/cloud-messaging/admin/manage-topic-subscriptions

  console.log('unsubscribing from the topic fcm');

  return admin.messaging().unsubscribeFromTopic([token], '/topics/' + topic); // Returns a promise
};

module.exports.renderTemplate = function (template_name, params, callback) {
  var full_template_path = path.join(__dirname, '..', 'views', 'templates', template_name);
  console.log('The email template path is: ' + full_template_path);
  var raw_template = fs.readFileSync(full_template_path, 'utf8');
  var rendered_template = nunjucks.renderString(raw_template, params);

  if (callback) {
    callback(rendered_template);
  }

  return rendered_template;

  /*
        To use,

        var rendered_template = utilities.renderTemplate("signup.html");

        // And then send the email like this.
        utilities.sendEmail(
            {
                email: user_data.email,
                name: "User."
            },
            "Welcome to the website",
            email
        );

    */
};

/*
    To use:

//    var config = require("../config/config");
    var utilities = require("../utilities/utilities");

    // Implement the callback version as well.

    var user_credentials = utilities.decryptJWTWithToken(req.get("X-AUTH-TOKEN"));

    if(!user_credentials){
        res.status(401).json({
            success: false,
            error: {
                message: "Unauthorized for transaction"
            }
        });
        return;
    }
*/
