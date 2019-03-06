const user = require("../tests/utils/mockUserPayload");
const { createUser } = require("../utils/datastore");

createUser(user);
