const { duplicateTree } = require("./utils");

describe("Duplicate utils", () => {
  describe("duplicateTree", () => {
    let trx, builder;
    beforeEach(() => {
      builder = {
        andWhere: jest.fn(),
        andWhereRaw: jest.fn(),
        orWhereIn: jest.fn()
      };
      trx = {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue([]),
        where: func => {
          func(builder);
          return trx;
        },
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([])
      };
    });

    it("should select the entities linking to a parent", async () => {
      const references = {
        parents: {
          1: "newId1",
          2: "newId2"
        }
      };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [
            {
              column: "parentId",
              entityName: "parents",
              parent: true
            }
          ]
        }
      ];
      await duplicateTree(trx, tree, references);
      expect(trx.select).toHaveBeenCalledWith("*");
      expect(trx.from).toHaveBeenCalledWith("entities");
      expect(builder.orWhereIn).toHaveBeenCalledWith("parentId", ["1", "2"]);
      expect(builder.andWhere).toHaveBeenCalledWith({ isDeleted: false });
    });

    it("should not filter by isDeleted when there is no deleted column", async () => {
      const references = { parents: { p1: "newId1", p2: "newId2" } };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [{ column: "parentId", entityName: "parents", parent: true }],
          noIsDeleted: true
        }
      ];

      await duplicateTree(trx, tree, references);

      expect(builder.andWhere).not.toHaveBeenCalled();
    });

    it("should filter by additional where clause when provided", async () => {
      const references = { parents: { p1: "newId1", p2: "newId2" } };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [{ column: "parentId", entityName: "parents", parent: true }],
          where: "1 = 1"
        }
      ];

      await duplicateTree(trx, tree, references);

      expect(builder.andWhereRaw).toHaveBeenCalledWith("1 = 1");
    });

    it("should insert the new values with parent references updated", async () => {
      const references = { parents: { p1: "newId1", p2: "newId2" } };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [{ column: "parentId", entityName: "parents", parent: true }]
        }
      ];

      const entities = [
        { id: "e1", parentId: "p1" },
        { id: "e2", parentId: "p2" }
      ];
      trx.orderBy = jest.fn().mockResolvedValue(entities);

      await duplicateTree(trx, tree, references);

      expect(trx.insert).toHaveBeenCalledWith([
        { parentId: "newId1" },
        { parentId: "newId2" }
      ]);
      expect(trx.into).toHaveBeenCalledWith("entities");
      expect(trx.returning).toHaveBeenCalledWith("id");
    });

    it("should update references for non parent links", async () => {
      const references = {
        parents: { p1: "newId1", p2: "newId2" },
        others: { o1: "newO1", o2: "newO2" }
      };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [
            { column: "parentId", entityName: "parents", parent: true },
            { column: "otherId", entityName: "others" }
          ]
        }
      ];

      const entities = [
        { id: "e1", parentId: "p1", otherId: "o2" },
        { id: "e2", parentId: "p2", otherId: "o1" }
      ];
      trx.orderBy = jest.fn().mockResolvedValue(entities);

      await duplicateTree(trx, tree, references);

      expect(trx.insert).toHaveBeenCalledWith([
        { otherId: "newO2", parentId: "newId1" },
        { otherId: "newO1", parentId: "newId2" }
      ]);
    });

    it("should not update references if no replacement is found", async () => {
      const references = {
        parents: { p1: "newId1", p2: "newId2" }
      };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [
            { column: "parentId", entityName: "parents", parent: true },
            { column: "otherId", entityName: "others" }
          ]
        }
      ];

      const entities = [
        { id: "e1", parentId: "p1", otherId: "o2" },
        { id: "e2", parentId: "p2", otherId: "o1" }
      ];
      trx.orderBy = jest.fn().mockResolvedValue(entities);

      await duplicateTree(trx, tree, references);

      expect(trx.insert).toHaveBeenCalledWith([
        { otherId: "o2", parentId: "newId1" },
        { otherId: "o1", parentId: "newId2" }
      ]);
    });

    it("should save the references mapping the old to new ids", async () => {
      const references = { parents: { p1: "newId1", p2: "newId2" } };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [{ column: "parentId", entityName: "parents", parent: true }]
        }
      ];

      const entities = [
        { id: "e1", parentId: "p1" },
        { id: "e2", parentId: "p2" }
      ];
      trx.orderBy = jest.fn().mockResolvedValue(entities);
      trx.returning = jest.fn().mockResolvedValue(["newE1", "newE2"]);

      await duplicateTree(trx, tree, references);

      expect(references).toMatchObject({
        entity: {
          e1: "newE1",
          e2: "newE2"
        }
      });
    });

    it("should drop id and timestamps to not duplicate them", async () => {
      const references = { parents: { p1: "newId1", p2: "newId2" } };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [{ column: "parentId", entityName: "parents", parent: true }]
        }
      ];

      const entities = [
        {
          id: "e1",
          parentId: "p1",
          other: "bar",
          createdAt: "createdTime",
          updatedAt: "updatedTime"
        },
        {
          id: "e2",
          parentId: "p2",
          other: "foo",
          createdAt: "createdTime",
          updatedAt: "updatedTime"
        }
      ];
      trx.orderBy = jest.fn().mockResolvedValue(entities);

      await duplicateTree(trx, tree, references);

      expect(trx.insert).toHaveBeenCalledWith([
        { parentId: "newId1", other: "bar" },
        { parentId: "newId2", other: "foo" }
      ]);
    });

    it("should transform the entity with the transform provided before insertion", async () => {
      const references = { parents: { p1: "newId1", p2: "newId2" } };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [{ column: "parentId", entityName: "parents", parent: true }],
          transform: entity => ({
            ...entity,
            parentId: `${entity.parentId}foo`
          })
        }
      ];

      const entities = [
        {
          id: "e1",
          parentId: "p1"
        },
        {
          id: "e2",
          parentId: "p2"
        }
      ];
      trx.orderBy = jest.fn().mockResolvedValue(entities);

      await duplicateTree(trx, tree, references);

      expect(trx.insert).toHaveBeenCalledWith([
        { parentId: "newId1foo" },
        { parentId: "newId2foo" }
      ]);
    });

    it("should select the child entities based on the parents it inserted and insert with the new references", async () => {
      const references = { parents: { p1: "newId1", p2: "newId2" } };
      const tree = [
        {
          name: "entity",
          table: "entities",
          links: [{ column: "parentId", entityName: "parents", parent: true }]
        },
        {
          name: "child",
          table: "children",
          links: [{ column: "entityId", entityName: "entity", parent: true }]
        }
      ];

      let orderCount = 0;
      trx.orderBy = jest.fn().mockImplementation(() => {
        let result;
        if (orderCount === 0) {
          result = [{ id: "e1", parentId: "p1" }, { id: "e2", parentId: "p2" }];
        } else if (orderCount === 1) {
          result = [{ id: "c1", entityId: "e1" }, { id: "c2", entityId: "e2" }];
        }
        orderCount++;
        return Promise.resolve(result);
      });

      let returningCount = 0;
      trx.returning = jest.fn().mockImplementation(() => {
        let result;
        if (returningCount === 0) {
          result = ["newE1", "newE2"];
        } else if (orderCount === 1) {
          result = ["newC1", "newC2"];
        }

        return Promise.resolve(result);
      });

      await duplicateTree(trx, tree, references);
      expect(builder.orWhereIn.mock.calls[1]).toEqual([
        "entityId",
        ["e1", "e2"]
      ]);

      expect(trx.insert.mock.calls[1]).toEqual([
        [{ entityId: "newE1" }, { entityId: "newE2" }]
      ]);
    });
  });
});
