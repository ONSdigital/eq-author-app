const { getUserBySub } = require("../utils/datastore");
const verifyPublisherRequest = require("../utils/verifyPublisherRequest");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header(
      process.env.AUTH_HEADER_KEY || "authorization"
    );
    verifyPublisherRequest(authHeader);
    req.user = req.auth;
    next();
    return;
  } catch (e) {
    let user = await getUserBySub(req.auth.sub);

    if (!user) {
      res.status(401).send("User does not exist");
      return;
    }

    req.user = user;

    next();
  }
};
