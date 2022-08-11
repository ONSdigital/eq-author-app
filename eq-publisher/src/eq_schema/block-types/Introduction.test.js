const Introduction = require("./Introduction");

const piping = '<span data-piped="metadata" data-id="1">[some_metadata]</span>';

describe("Introduction", () => {
  let apiData, context;
  beforeEach(() => {
    apiData = {
      id: "1",
      description: `<ul><li>Data should relate to all sites in England, Scotland, Wales and Northern Ireland unless otherwise stated. </li><li>You can provide info estimates if actual figures are not available.</li><li>We will treat your data securely and confidentially.</li><li>${piping}</li></ul>`,
      legalBasis: "NOTICE_2",
      secondaryTitle: `<p>Information you need ${piping}</p>`,
      secondaryDescription:
        "<p>You can select the dates of the period you are reporting for, if the given dates are not appropriate.</p>",

      collapsibles: [
        {
          id: "d45bf1dd-f286-40ca-b6a2-fe0014574c36",
          title: "<p>Hello</p>",
          description: `<p>World ${piping}</p>`,
        },
        {
          id: "1e7e5ecd-6f4c-4219-9893-6efdeea36ad0",
          title: "<p>Collapsible</p>",
          description: "<p>Description</p>",
        },
      ],
      tertiaryTitle: `<p>How we use your data ${piping}</p>`,
      tertiaryDescription: `<ul><li>You cannot appeal your selection. Your business was selected to give us a comprehensive view of the UK economy.</li><li>The information you provide contributes to Gross Domestic Product (GDP).</li><li>${piping}</li></ul>`,
    };
    context = {
      questionnaireJson: {
        metadata: [{ id: "1", key: "some_metadata" }],
      },
    };
  });

  it("set the correct id and type", () => {
    const introduction = new Introduction(apiData, context);
    expect(introduction.type).toEqual("Introduction");
    expect(introduction.id).toEqual("introduction-block");
  });

  it("should define the primary_content", () => {
    const introduction = new Introduction(apiData, context);
    expect(introduction.primary_content).toMatchObject([
      {
        content: [
          {
            list: [
              "Data should relate to all sites in England, Scotland, Wales and Northern Ireland unless otherwise stated. ",
              "You can provide info estimates if actual figures are not available.",
              "We will treat your data securely and confidentially.",
              "{{ metadata['some_metadata'] }}",
            ],
          },
        ],
        id: "primary",
        type: "Basic",
      },
    ]);
  });

  it("should define the additional_content", () => {
    apiData.additionalGuidancePanelSwitch = true;
    apiData.additionalGuidancePanel = "Big string full of content";
    const introduction = new Introduction(apiData, context);
    expect(introduction.primary_content).toMatchObject([
      {
        content: [
          {
            description:
              "<div class='panel panel--simple panel--info'><div class='panel__body'>Big string full of content</div></div>",
          },
          {
            list: [
              "Data should relate to all sites in England, Scotland, Wales and Northern Ireland unless otherwise stated. ",
              "You can provide info estimates if actual figures are not available.",
              "We will treat your data securely and confidentially.",
              "{{ metadata['some_metadata'] }}",
            ],
          },
        ],
        id: "primary",
        type: "Basic",
      },
    ]);
  });

  it("should define the preview_content from the secondary settings", () => {
    const introduction = new Introduction(apiData, context);
    expect(introduction.preview_content).toMatchObject({
      content: [
        {
          description:
            "You can select the dates of the period you are reporting for, if the given dates are not appropriate.",
        },
      ],
      id: "preview",
      questions: expect.any(Array),
      title: "Information you need {{ metadata['some_metadata'] }}",
    });
  });

  it("should define the preview_content questions from collapsibles", () => {
    const introduction = new Introduction(apiData, context);
    expect(introduction.preview_content.questions).toMatchObject([
      {
        content: [{ description: "World {{ metadata['some_metadata'] }}" }],
        question: "<p>Hello</p>",
      },
      {
        content: [{ description: "Description" }],
        question: "<p>Collapsible</p>",
      },
    ]);
  });

  it("should not publish partially completed collapsibles", () => {
    apiData.collapsibles = [
      {
        id: "d45bf1dd-f286-40ca-b6a2-fe0014574c36",
        title: "<p>Hello</p>",
        description: "<p>World</p>",
      },
      {
        id: "d45bf1dd-f286-40ca-b6a2-fe0014574c36",
        title: "<p>Hello</p>",
        description: "",
      },
      {
        id: "d45bf1dd-f286-40ca-b6a2-fe0014574c36",
        title: "",
        description: "<p>Description</p>",
      },
    ];
    const introduction = new Introduction(apiData, context);
    expect(introduction.preview_content.questions).toMatchObject([
      {
        content: [{ description: "World" }],
        question: "<p>Hello</p>",
      },
    ]);
  });

  it("should define the secondary_content from the tertiary settings", () => {
    const introduction = new Introduction(apiData, context);
    expect(introduction.secondary_content).toMatchObject([
      {
        content: [
          {
            list: [
              "You cannot appeal your selection. Your business was selected to give us a comprehensive view of the UK economy.",
              "The information you provide contributes to Gross Domestic Product (GDP).",
              "{{ metadata['some_metadata'] }}",
            ],
          },
        ],
        id: "secondary-content",
        title: "How we use your data {{ metadata['some_metadata'] }}",
      },
    ]);
  });
});
