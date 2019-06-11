const admin = require("firebase-admin");

/*
Must define firebase service account credentials for each environment:
1. Download firebase service account json file and save in eq-author-api root as .firebase-admin-service-account.json
    https://firebase.google.com/docs/admin/setup

2. Set env variable. Create /eq-author-api/.env file containing:
    GOOGLE_APPLICATION_CREDENTIALS=/app/.firebase-admin-service-account.json
    nb. /app/ is the root in docker container to eq-author-api
*/

admin.initializeApp();

const verifyJwtToken = function(accessToken) {
  // Verify JWT token comes from Firebase
  return admin
    .auth()
    .verifyIdToken(accessToken)
    .then(function(decodedToken) {
      return decodedToken;
    })
    .catch(function(error) {
      return {
        error,
      };
    });
};

module.exports = {
  verifyJwtToken,
};
