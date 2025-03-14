const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Add your service account key here

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event, context) => {
  try {
    const { userId } = JSON.parse(event.body);
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
