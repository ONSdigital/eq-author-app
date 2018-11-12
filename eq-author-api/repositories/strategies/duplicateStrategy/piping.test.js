const updatePiping = require("./piping");

describe("Update piping", () => {
  let trx, builder;
  beforeEach(() => {
    builder = {
      orWhere: jest.fn()
    };
    trx = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      andWhere: func => {
        func(builder);
        return trx;
      },
      whereIn: jest.fn().mockReturnThis(),
      table: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([])
    };
  });

  it("should retrieve pages that have been updated and have piping", async () => {
    const references = {
      pages: {
        "1": "new1",
        "2": "new2"
      }
    };

    await updatePiping(trx, references);

    expect(trx.select).toHaveBeenCalledWith("*");
    expect(trx.from).toHaveBeenCalledWith("Pages");
    expect(trx.whereIn).toHaveBeenCalledWith("id", ["new1", "new2"]);
    expect(builder.orWhere).toHaveBeenCalledWith("title", "like", "%<%");
    expect(builder.orWhere).toHaveBeenCalledWith("description", "like", "%<%");
    expect(builder.orWhere).toHaveBeenCalledWith("guidance", "like", "%<%");
  });

  it("should retrieve sections that have been updated and have piping", async () => {
    const references = {
      sections: {
        "1": "new1",
        "2": "new2"
      }
    };

    await updatePiping(trx, references);

    expect(trx.select).toHaveBeenCalledWith("*");
    expect(trx.from).toHaveBeenCalledWith("Sections");
    expect(trx.whereIn).toHaveBeenCalledWith("id", ["new1", "new2"]);
    expect(builder.orWhere).toHaveBeenCalledWith(
      "introductionTitle",
      "like",
      "%<%"
    );
    expect(builder.orWhere).toHaveBeenCalledWith(
      "introductionContent",
      "like",
      "%<%"
    );
  });

  it("should update the piping value and save it back to the database", async () => {
    const references = {
      pages: {
        "1": "new1"
      },
      answers: {
        a1: "newA1"
      },
      metadata: {
        m1: "newM1"
      }
    };
    trx.andWhere = async func => {
      func(builder);
      return [
        {
          id: "new1",
          title:
            'Title <span data-piped="answers" data-id="a1" data-type="TextField">{{Answer 1}}</span>',
          guidance:
            'Guidance <span data-piped="metadata" data-id="m1" data-type="TextField">{{Metadata 1}}</span>'
        }
      ];
    };

    await updatePiping(trx, references);

    expect(trx.table).toHaveBeenCalledWith("Pages");
    expect(trx.update).toHaveBeenCalledWith({
      title:
        'Title <span data-piped="answers" data-id="newA1" data-type="TextField">{{Answer 1}}</span>',
      guidance:
        'Guidance <span data-piped="metadata" data-id="newM1" data-type="TextField">{{Metadata 1}}</span>'
    });
    expect(trx.where).toHaveBeenCalledWith({
      id: "new1"
    });
  });

  it("should update the piping for sections and save it back to the database", async () => {
    const references = {
      sections: {
        "1": "new1"
      },
      answers: {
        a1: "newA1"
      },
      metadata: {
        m1: "newM1"
      }
    };
    trx.andWhere = async func => {
      func(builder);
      return [
        {
          id: "new1",
          introductionTitle:
            'introTitle <span data-piped="answers" data-id="a1" data-type="TextField">{{Answer 1}}</span>',
          introductionContent:
            'introContent <span data-piped="metadata" data-id="m1" data-type="TextField">{{Metadata 1}}</span>'
        }
      ];
    };

    await updatePiping(trx, references);

    expect(trx.table).toHaveBeenCalledWith("Sections");
    expect(trx.update).toHaveBeenCalledWith({
      introductionTitle:
        'introTitle <span data-piped="answers" data-id="newA1" data-type="TextField">{{Answer 1}}</span>',
      introductionContent:
        'introContent <span data-piped="metadata" data-id="newM1" data-type="TextField">{{Metadata 1}}</span>'
    });
    expect(trx.where).toHaveBeenCalledWith({
      id: "new1"
    });
  });

  it("should do nothing if there are no changed entities that could have piping", async () => {
    const references = {
      answers: {
        a1: "newA1"
      },
      metadata: {
        m1: "newM1"
      }
    };

    await updatePiping(trx, references);

    expect(trx.update).not.toHaveBeenCalled();
  });
});
