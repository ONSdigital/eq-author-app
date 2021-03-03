#!/usr/bin/env node
/* eslint-disable import/unambiguous */
const fs = require("fs").promises;
const jsonPath = process.env.DATA_DIR;
const { createUser, getUserByExternalId } = require("../db/datastore");

fs.readFile(jsonPath, "utf8").then((data) => {
  const json = JSON.parse(data);
  json.users.map(async (user) => {
    const { email, displayName, localId } = user;
    const existingUser = await getUserByExternalId(localId);
    if (!existingUser) {
      await createUser({ email, name: displayName, externalId: localId });
    }
  });
});
