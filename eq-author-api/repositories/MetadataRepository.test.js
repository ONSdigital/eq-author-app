const { map, times, omit } = require("lodash");

const db = require("../db");
const QuestionnaireRepository = require("../repositories/QuestionnaireRepository");
const MetadataRepository = require("../repositories/MetadataRepository");

const buildQuestionnaire = (json = {}) => {
  return Object.assign(
    {
      title: "Test questionnaire",
      surveyId: "1",
      theme: "default",
      legalBasis: "Voluntary",
      navigation: false,
      createdBy: "foo"
    },
    json
  );
};

const buildMetadata = (questionnaireId, json = {}) => {
  return Object.assign(
    {
      type: "Text",
      questionnaireId: questionnaireId
    },
    json
  );
};

describe("MetadataRepository", () => {
  let questionnaireId;

  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());
  afterEach(() => db("Questionnaires").delete());
  beforeEach(async () => {
    const questionnaire = buildQuestionnaire({ title: "New questionnaire" });
    ({ id: questionnaireId } = await QuestionnaireRepository.insert(
      questionnaire
    ));
  });

  it("should retrieve a single Metadata", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);
    const result = await MetadataRepository.getById(id);

    expect(result.id).toBe(id);
    expect(result).toMatchObject({
      type: "Text",
      questionnaireId
    });
  });

  it("should retrieve all Metadata", async () => {
    const metadata = times(4, async () => {
      const metadata = buildMetadata(questionnaireId);
      const { id } = await MetadataRepository.insert(metadata);
      return id;
    });
    const metadataIds = await Promise.all(metadata);
    const results = map(await MetadataRepository.findAll(), "id");
    expect(results).toEqual(expect.arrayContaining(metadataIds));
  });

  it("should create new Metadata", async () => {
    const metadata = buildMetadata(questionnaireId);
    const result = await MetadataRepository.insert(metadata);
    expect(result).toMatchObject({
      type: "Text",
      questionnaireId
    });
  });

  it("should update Metadata - text", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "foo_bar",
      alias: "Reporting Unit Reference",
      type: "Text",
      textValue: "10000000",
      questionnaireId: questionnaireId
    };

    const result = await MetadataRepository.update(updateValues);

    expect(result).toMatchObject(
      omit({ ...updateValues, value: "10000000" }, ["textValue"])
    );
  });

  it("should update Metadata - date", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "foo_bar",
      alias: "Reporting Unit Reference",
      type: "Date",
      dateValue: new Date("2018-09-04"),
      questionnaireId: questionnaireId
    };

    const result = await MetadataRepository.update(updateValues);

    expect(result).toMatchObject(
      omit(
        {
          ...updateValues,
          value: expect.stringContaining("2018-09-04")
        },
        ["dateValue"]
      )
    );
  });

  it("should update Metadata - region", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "foo_bar",
      alias: "Reporting Unit Reference",
      type: "Region",
      regionValue: "GB_ENG",
      questionnaireId: questionnaireId
    };

    const result = await MetadataRepository.update(updateValues);

    expect(result).toMatchObject(
      omit({ ...updateValues, value: "GB_ENG" }, ["regionValue"])
    );
  });

  it("should update Metadata - language", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "foo_bar",
      alias: "Reporting Unit Reference",
      type: "Language",
      languageValue: "en",
      questionnaireId: questionnaireId
    };

    const result = await MetadataRepository.update(updateValues);

    expect(result).toMatchObject(
      omit({ ...updateValues, value: "en" }, ["languageValue"])
    );
  });

  it("should update Metadata Language type with default value", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "",
      alias: "",
      type: "Language",
      languageValue: "",
      questionnaireId: questionnaireId
    };

    const result = await MetadataRepository.update(updateValues);

    expect(result).toMatchObject(
      omit({ ...updateValues, value: "en" }, ["languageValue"])
    );
  });

  it("should update Metadata Region type with default value", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "",
      alias: "",
      type: "Region",
      regionValue: "",
      questionnaireId: questionnaireId
    };

    const result = await MetadataRepository.update(updateValues);

    expect(result).toMatchObject(
      omit({ ...updateValues, value: "GB_ENG" }, ["regionValue"])
    );
  });

  it("should update Metadata type and use update value", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "",
      alias: "",
      type: "Text",
      textValue: "test",
      questionnaireId: questionnaireId
    };

    await MetadataRepository.update(updateValues);

    const result = await MetadataRepository.update({
      ...updateValues,
      type: "Region",
      regionValue: "GB_ENG"
    });

    expect(result).toMatchObject(
      omit(
        {
          ...updateValues,
          type: "Region",
          value: "GB_ENG"
        },
        ["regionValue", "textValue"]
      )
    );
  });

  it("should update Metadata value with default values", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "ru_ref",
      alias: "",
      type: "Text",
      languageValue: "",
      questionnaireId: questionnaireId
    };

    const result = await MetadataRepository.update(updateValues);

    expect(result).toMatchObject({
      id,
      key: "ru_ref",
      alias: "Ru Ref",
      type: "Text",
      value: "12346789012A"
    });
  });

  it("should update Metadata with new defaults when new key given", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "ru_ref",
      alias: "",
      type: "Text",
      languageValue: "",
      questionnaireId: questionnaireId
    };

    await MetadataRepository.update(updateValues);
    const result = await MetadataRepository.update({
      ...updateValues,
      key: "ru_name"
    });

    expect(result).toMatchObject({
      id,
      key: "ru_name",
      alias: "Ru Name",
      type: "Text",
      value: "ESSENTIAL ENTERPRISE LTD."
    });
  });

  it("should update Metadata with custom values when same key given", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);

    const updateValues = {
      id,
      key: "tx_id",
      alias: "",
      type: "Text",
      textValue: "",
      questionnaireId: questionnaireId
    };

    await MetadataRepository.update(updateValues);
    const result = await MetadataRepository.update({
      ...updateValues,
      key: "tx_id",
      textValue: "foobar"
    });

    expect(result).toMatchObject({
      id,
      value: "foobar"
    });
  });

  it("should remove Metadata", async () => {
    const metadata = buildMetadata(questionnaireId);
    const { id } = await MetadataRepository.insert(metadata);
    await MetadataRepository.remove(id);
    const result = await MetadataRepository.getById(id);
    expect(result).toBeUndefined();
  });
});
