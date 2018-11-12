module.exports = (req, res) => {
  res.json({
    status: "OK",
    version: process.env.EQ_AUTHOR_API_VERSION
  });
};
