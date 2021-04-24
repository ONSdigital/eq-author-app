beforeAll(async () => {
  const datastore = require("../db/datastore");
  await datastore.connectDB();
});

afterAll(async () => {
  const { MongoClient } = require("mongodb");
  connection = await MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = await connection.db();
  await db.collection("questionnaires").deleteMany({});
  await db.collection("versions").deleteMany({});
  await db.collection("users").deleteMany({});
  await db.collection("comments").deleteMany({});
});
