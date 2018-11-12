module.exports = (req, res) => {
  res.json({
    status: "OK",
    version: process.env.EQ_PUBLISHER_VERSION
  });
};
