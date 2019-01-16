const db = require("./");
const config = require("../knexfile.js");
jest.mock("aws-sdk");

describe("Knex", () => {
  it("should use default config when not passed a secret_id", async () => {
    let conf = await db("");
    expect(conf).toEqual(config);
  });

  it("should retrieve database credentials from AWS SecretsManager", async () => {
    let secretValue = {
      username: "author",
      password: "author_password",
      engine: "postgres",
      host: "localhost",
      port: 5432,
      dbname: "author",
      dbInstanceIdentifier: "authordb",
    };

    require("aws-sdk").__setSecretValue(JSON.stringify(secretValue));
    let conf = await db("test/rds/secret");

    expect(conf.connection).toEqual({
      host: secretValue.host,
      port: secretValue.port,
      user: secretValue.username,
      password: secretValue.password,
      database: secretValue.dbname,
      dbInstanceIdentifier: secretValue.dbInstanceIdentifier,
      engine: secretValue.engine,
    });
  });

  it("should exit when retrieving database credentials from AWS SecretsManager fails", async () => {
    require("aws-sdk").__setShouldError(true);
    const exit = jest
      .spyOn(process, "exit")
      .mockImplementation(number => number);

    await db("test/rds/secret");

    expect(exit).toHaveBeenCalledWith(1);
  });
});
