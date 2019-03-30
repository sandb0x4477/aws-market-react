var express = require('express');
var bodyParser = require('body-parser');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
require('dotenv').config();
var stripe = require('stripe')(process.env.STRIPE_SECRET);
var AWS = require('aws-sdk');

const convertFromCents = price => (price / 100).toFixed(2);

const config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKry: process.env.SECRET_KEY_ID,
  region: 'eu-west-1',
  adminEmail: 'novasettler@gmail.com'
};

var ses = new AWS.SES(config);

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const chargeHandler = async (req, res, next) => {
  const { token } = req.body;
  const { currency, amount, description } = req.body.charge;
  // const { customerEmail, ownerEmail, shipped } = req.body.email;
  try {
    const charge = await stripe.charges.create({
      source: token.id,
      amount,
      currency,
      description
    });
    if (charge.status === 'succeeded') {
      req.charge = charge;
      req.description = description;
      req.email = req.body.email;
      next();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const emailHandler = async (req, res) => {
  const {
    charge,
    description,
    email: { ownerEmail, customerEmail, shipped }
  } = req;
  ses.sendEmail(
    {
      Source: ownerEmail,
      ReturnPath: ownerEmail,
      Destination: {
        ToAddresses: [config.adminEmail, ownerEmail, customerEmail]
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Order Details - AWS-Market'
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<h3>Order Processed</h3>
<p>${description} - ${convertFromCents(charge.amount)}</p>
<p>Customer Email: <a href="mailto:${customerEmail}">${customerEmail}</a></p>
<p>Contact your Seller: <a href="mailto:${ownerEmail}">${ownerEmail}</a></p>

${
  shipped
    ? `
<h4>Mailing address</h4>
<p>${charge.source.name}</p>
<p>${charge.source.address_line1}</p>
<p>${charge.source.address_city}</p>
<p>${charge.source.address_state}</p>
<p>${charge.source.address_zip}</p>
`
    : 'Email product'
}

<p style="font-style: italic; color: grey;">
  ${
    shipped
      ? 'Your product will be shipped in 2-3 days'
      : 'Check your verified email for your product'
  }
</p>
`
          }
        }
      }
    },
    (error, data) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.json({
        message: 'Order processed successfully',
        charge,
        data
      });
    }
  );
};

app.post('/charge', chargeHandler, emailHandler);

// app.post('/charge/*', function(req, res) {
//   // Add your code here
//   res.json({ success: 'post call succeed!', url: req.url, body: req.body });
// });

app.listen(3000, function() {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
