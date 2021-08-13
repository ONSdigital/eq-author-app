#!/usr/bin/env node
const admin = require("firebase-admin");
const program = require("commander");
const fs = require("fs").promises;
const { logger } = require("../utils/logger");

program
  .description("A utility that applies the verified email to a firebase user.")
  .usage("-p <projectName> -u <uid> -k <serviceAccountKey> [-r]")
  .option(
    "-k, --service-account-key <serviceAccountKey>",
    "path to the service account key file"
  )
  .option(
    "-p, --projectName <projectName>",
    "firebase project name used for DatabaseURL"
  )
  .option("-u, --uid <uid>", "firebase user Id to make verifiy email")
  .option("-r, --remove", "remove the email verified role")
  .parse(process.argv);

const formatError = (arg) => `Missing ${arg}. See -h for usage info.`;

const makeEmailVerified = async (
  projectName,
  uid,
  serviceAccountKey,
  remove = false
) => {
  if (!projectName) {
    throw new Error(formatError("project name"));
  }
  if (!uid) {
    throw new Error(formatError("uid"));
  }

  if (!serviceAccountKey) {
    throw new Error(formatError("service account key"));
  }

  const serviceAccount = await fs.readFile(serviceAccountKey, "utf-8");
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
    databaseURL: `https://${projectName}.firebaseio.com`,
  });

  await admin.auth().updateUser(uid, {
    emailVerified: !remove,
  });

  const userRecord = await admin.auth().getUser(uid);
  return userRecord.emailVerified;
};

const options = program.opts();
makeEmailVerified(
  options.projectName,
  options.uid,
  options.serviceAccountKey,
  options.remove
)
  .then((isEmailVerified) => {
    logger.info(
      `User ${options.uid} in ${options.projectName} has ${
        isEmailVerified === true ? "email verified" : "not email verified"
      }`
    );
    process.exit(0);
  })
  .catch((e) => {
    logger.fatal(e);
    process.exit(1);
  });
