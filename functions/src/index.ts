/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const onPlayerUpdate =
functions.firestore.document("players/7u7fRPJUMxEqrkIg3Puk").onUpdate(change => {
  const after = change.after.data();
  const payload = {
    data: {
      name: after.name,
      age: String(after.age)
    }
  }
  //const timestamp = Date.now();
  return admin.messaging().sendToTopic("players_7u7fRPJUMxEqrkIg3Puk", payload)
  .catch(error => {
    console.error("fcm failed")
  })
})

export const getPlayerInfo = functions.https.onRequest((request, response) => {
  admin.firestore().doc("players/7u7fRPJUMxEqrkIg3Puk").get()
    .then((snapshot) => {
      const data = snapshot.data();
      response.send(data);
    })
    .catch((error) => {
      console.log(error);
      response.status(500).send(error);
    });
});
