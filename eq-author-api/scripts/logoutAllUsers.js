#!/usr/bin/env node
const admin = require("firebase-admin");
const program = require("commander");
const fs = require("fs").promises;
const { logger } = require("../utils/logger");

program
  .description("A script to logout all users currently logged into Author")
  .usage("-p <projectName> -k <serviceAccountKey> [-r]")
  .option(
    "-k, --service-account-key <serviceAccountKey>",
    "path to the service account key file"
  )
  .option(
    "-p, --projectName <projectName>",
    "firebase project name used for DatabaseURL"
  )
  .parse(process.argv);

const formatError = (arg) => `Missing ${arg}. See -h for usage info.`;

const logoutAllUsers = async (
  projectName,
  serviceAccountKey,
  nextPageToken
) => {
  if (!projectName) {
    throw new Error(formatError("project name"));
  }
  if (!serviceAccountKey) {
    throw new Error(formatError("service account key"));
  }

  const serviceAccount = await fs.readFile(serviceAccountKey, "utf-8");

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
    databaseURL: `https://${projectName}.firebaseio.com`,
  });

  const allUsers = await admin.auth().listUsers(1000, nextPageToken);

  // https://firebase.google.com/docs/auth/admin/manage-sessions#revoke_refresh_tokens
  await Promise.all(
    allUsers.users.map(async (userRecord) => {
      return admin
        .auth()
        .revokeRefreshTokens(userRecord.uid)
        .then(() => {
          return admin.auth().getUser(userRecord.uid);
        })
        .then((userRecord) => {
          return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
        })
        .then((timestamp) => {
          logger.info(
            `Tokens revoked for user ${userRecord.uid} at: ${timestamp}`
          );
        });
    })
  );
};

const options = program.opts();
logoutAllUsers(options.projectName, options.serviceAccountKey)
  .then(() => {
    logger.info("All users logged out");
    process.exit(0);
  })
  .catch((e) => {
    logger.fatal(e);
    process.exit(1);
  });
