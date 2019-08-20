const { cloneDeep } = require("lodash");
const addExpressionOperator = require("./addExpressionOperator.js");
const AND = "And";
const OR = "Or";

describe("addExpressionOperator", () => {
  let questionnaire = {};
  beforeEach(() => {
    questionnaire = {
      id: "3e14c1ac-4d05-4929-a7c6-58644dfc514a",
      title: "Q1",
      metadata: [],
      sections: [
        {
          id: "1f0a09c8-93fb-46c1-b568-2aecb7f085af",
          title: "",
          pages: [
            {
              id: "52e3721c-24b7-4906-ab06-dfc78e1f484a",
              title: "<p>Q1</p>",
              pageType: "QuestionPage",
              answers: [
                {
                  id: "d091276b-97b1-4eff-a845-a795a2279c46",
                  type: "Radio",
                  options: [
                    {
                      id: "4d80513f-f285-4cea-8fd0-9b422fcb980a",
                      label: "A",
                    },
                    {
                      id: "e05b6cdb-91c9-435d-bb25-1766b6415e44",
                      label: "B",
                    },
                    {
                      id: "4f70ae7b-e650-4424-96f0-880c6ea9bcd5",
                      label: "C",
                    },
                  ],
                  mutuallyExclusiveOption: null,
                },
              ],
              routing: null,
            },
            {
              id: "d94f7a1a-7fe4-47e4-9d57-11e518e90124",
              title: "<p>Q2</p>",
              pageType: "QuestionPage",
              answers: [
                {
                  id: "316bff79-08ad-4379-9b4a-6069c7593da8",
                  type: "Radio",
                  label: "a2",
                  options: [
                    {
                      id: "c1e25d8b-8034-466e-9c23-0a24cad64626",
                      label: "D",
                    },
                    {
                      id: "8d14139d-5f05-44b0-bc91-bf8a42394bf9",
                      label: "E",
                    },
                    {
                      id: "2cca166e-71f8-473a-be5d-539bdc6ed377",
                      label: "F",
                    },
                  ],
                },
              ],
              routing: {
                rules: [
                  {
                    expressionGroup: {
                      expressions: [
                        {
                          left: {
                            id: "316bff79-08ad-4379-9b4a-6069c7593da8",
                            type: "Radio",
                            options: [
                              {
                                id: "c1e25d8b-8034-466e-9c23-0a24cad64626",
                              },
                              {
                                id: "8d14139d-5f05-44b0-bc91-bf8a42394bf9",
                              },
                              {
                                id: "2cca166e-71f8-473a-be5d-539bdc6ed377",
                              },
                            ],
                          },
                          condition: "OneOf",
                          right: {
                            options: [
                              {
                                id: "c1e25d8b-8034-466e-9c23-0a24cad64626",
                                label: "D",
                              },
                              {
                                id: "8d14139d-5f05-44b0-bc91-bf8a42394bf9",
                                label: "E",
                              },
                            ],
                          },
                        },
                        {
                          left: {
                            id: "d091276b-97b1-4eff-a845-a795a2279c46",
                            type: "Radio",
                            options: [
                              {
                                id: "4d80513f-f285-4cea-8fd0-9b422fcb980a",
                              },
                              {
                                id: "e05b6cdb-91c9-435d-bb25-1766b6415e44",
                              },
                              {
                                id: "4f70ae7b-e650-4424-96f0-880c6ea9bcd5",
                              },
                            ],
                          },
                          condition: "OneOf",
                          right: {
                            options: [
                              {
                                id: "4d80513f-f285-4cea-8fd0-9b422fcb980a",
                                label: "A",
                              },
                              {
                                id: "e05b6cdb-91c9-435d-bb25-1766b6415e44",
                                label: "B",
                              },
                            ],
                          },
                        },
                      ],
                    },
                    destination: {
                      section: {
                        id: "03dbc0dd-2f05-4bbb-8dc8-e9edeb40b621",
                      },
                    },
                  },
                ],
                else: {
                  section: {
                    id: "2db427aa-ebf1-4ae5-9c32-611010026da2",
                  },
                },
              },
            },
          ],
        },
      ],
    };
  });
  it("should be deterministic", () => {
    expect(addExpressionOperator(cloneDeep(questionnaire))).toEqual(
      addExpressionOperator(cloneDeep(questionnaire))
    );
  });

  it("should add operator to expressionGroup if it doesnt exist", () => {
    const result = addExpressionOperator(questionnaire);
    expect(
      result.sections[0].pages[1].routing.rules[0].expressionGroup.operator
    ).toEqual(AND);
  });

  it("should not add operator if it already exists", () => {
    const withOperator = cloneDeep(questionnaire);
    withOperator.sections[0].pages[1].routing.rules[0].expressionGroup.operator = OR;
    const result = addExpressionOperator(withOperator);
    expect(
      result.sections[0].pages[1].routing.rules[0].expressionGroup.operator
    ).toEqual(OR);
  });
});
