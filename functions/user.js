const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth(); // Add this line to access Firebase Auth

exports.handler = async (event, context) => {
  try {
    const { email, password } = JSON.parse(event.body);

    // Sign in the user with Firebase Authentication
    const userCredential = await auth.signInWithEmailAndPassword(email, password);

    // If login is successful, return user data
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login successful", user: userCredential.user }),
    };
  } catch (error) {
    let errorMessage = "Login failed";

    if (error.code === "auth/user-not-found") {
      errorMessage = "Account does not exist.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password.";
    }

    return {
      statusCode: 401, // Use 401 Unauthorized for login errors
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
