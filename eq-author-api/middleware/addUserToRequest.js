const { getUserBySub } = require("../utils/datastore");

module.exports = async (req, res, next) => {
  /* 
  This if statement is currently required as a very short term fix
  due to publisher needing to make a graphql request in order to access 
  the questionnaire. This will hopefully be best fixed by 
  integrating the two services together.  
  */
  if (req.auth.user_id === "Publisher") {
    req.user = req.auth;
    next();
    return;
  }

  let user = await getUserBySub(req.auth.sub);

  if (!user) {
    res.status(401).send("User does not exist");
    return;
  }

  req.user = user;

  next();
};
