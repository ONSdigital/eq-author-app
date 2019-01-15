const knex = require("knex")(require("../knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
const DestinationRepository = require("./DestinationRepository")(knex);

const RoutingRule2Repository = require("./RoutingRule2Repository")(knex);

describe("Routing Rule 2 Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());

  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  let routing;
  beforeEach(async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              routing: {
                else: {
                  logical: "NextPage",
                },
              },
            },
          ],
        },
      ],
    });
    routing = questionnaire.sections[0].pages[0].routing;
  });

  describe("insert", () => {
    let destination;
    beforeEach(async () => {
      destination = await DestinationRepository.insert();
    });

    it("should create a routing rule", async () => {
      const routingRule = await RoutingRule2Repository.insert({
        routingId: routing.id,
        destinationId: destination.id,
      });

      expect(routingRule).toMatchObject({
        id: expect.any(Number),
        routingId: routing.id,
        destinationId: destination.id,
      });
    });
  });

  describe("getByRoutingId", () => {
    it("should retrieve all rules for a routing", async () => {
      const destination1 = await DestinationRepository.insert();
      const routingRule1 = await RoutingRule2Repository.insert({
        routingId: routing.id,
        destinationId: destination1.id,
      });
      const destination2 = await DestinationRepository.insert();
      const routingRule2 = await RoutingRule2Repository.insert({
        routingId: routing.id,
        destinationId: destination2.id,
      });

      const rules = await RoutingRule2Repository.getByRoutingId(routing.id);

      expect(rules).toEqual([
        expect.objectContaining({
          id: routingRule1.id,
          routingId: routing.id,
          destinationId: destination1.id,
        }),
        expect.objectContaining({
          id: routingRule2.id,
          routingId: routing.id,
          destinationId: destination2.id,
        }),
      ]);
    });
  });

  describe("getById", () => {
    it("should return the rule for the id", async () => {
      const destination = await DestinationRepository.insert();
      const rule = await RoutingRule2Repository.insert({
        routingId: routing.id,
        destinationId: destination.id,
      });

      const readRule = await RoutingRule2Repository.getById(rule.id);

      expect(readRule).toMatchObject(rule);
    });
  });

  describe("delete", () => {
    it("should delete returning the deleted rule", async () => {
      const destination = await DestinationRepository.insert();
      const rule = await RoutingRule2Repository.insert({
        routingId: routing.id,
        destinationId: destination.id,
      });

      const deleteResult = await RoutingRule2Repository.delete(rule.id);

      expect(deleteResult).toMatchObject(rule);
    });
  });
});
