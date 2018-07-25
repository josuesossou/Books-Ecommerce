const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const stripe = require('stripe')(functions.config().stripe.token)

// exports.turkeyStripeCharge = functions.database
//                                 .ref('/payments/{userId}/{paymentId}')
//                                 .onWrite(event => {

//   const payment = event.data.val();
//   const userId = event.params.userId;
//   const paymentId = event.params.paymentId;

//   // checks if payment exists or if it has already been charged
//   if (!payment || payment.charge) return;

//   return admin.database()
//               .ref(`/users/${userId}`)
//               .once('value')
//               .then(snapshot => {
//                   return snapshot.val();
//                })
//                .then(customer => {

//                  const amount = payment.amount;
//                  const idempotency_key = paymentId;  // prevent duplicate charges
//                  const source = payment.token.id;
//                  const currency = 'usd';
//                  const description = payment.description;
//                  const receipt_email = payment.receipt_email;
//                  const charge = {amount, currency, description, receipt_email, source};


//                  return stripe.charges.create(charge, { idempotency_key });

//                })
//                .then(charge => {
//                   admin.database()
//                         .ref(`/payments/${userId}/${paymentId}/charge`)
//                         .set(charge)
//                 })
// });

exports.bookStripeCharge = functions.database
                                .ref('/bookpayments/{userId}/{paymentId}')
                                .onWrite((change,context) => {
  const payment = change.after.val();
  const userId = context.params.userId;
  const paymentId = context.params.paymentId;
  
  // checks if payment exists or if it has already been charged
  if (!payment || payment.charge) return;

  return admin.database()
        .ref(`/users/${userId}`)
        .once('value')
        .then(snapshot => {
          return snapshot.val();
        })
        .then(customer => {
          const amount = payment.amount;
          const idempotency_key = paymentId;  // prevent duplicate charges
          const source = payment.token.id;
          const currency = 'usd';
          const description = payment.description;
          const receipt_email = payment.receipt_email;
          const charge = {amount, currency, description, receipt_email, source};

          return stripe.charges.create(charge, { idempotency_key });
        })
        .then(charge => {
          admin.database()
          .ref(`/bookpayments/${userId}/${paymentId}/charge`)
          .set(charge)

          return charge;
        })
        .then(charge => {
          
        });
});
