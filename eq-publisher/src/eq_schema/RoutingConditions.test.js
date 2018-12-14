const RoutingConditions = require("./RoutingConditions");

const radioRoutingCondition = [
  {
    id: "2",
    comparator: "Equal",
    answer: {
      id: "1",
      type: "Radio",
      options: [
        {
          id: "1",
          label: "Yes",
          value: "yes"
        },
        {
          id: "2",
          label: "No",
          value: "no"
        }
      ]
    },
    routingValue: {
      value: ["1"]
    }
  }
];

const buildNumberAnswer = (id, value, comparator = "Equal") => ({
  id: "1",
  comparator,
  answer: {
    id: `${id}`,
    type: "Number"
  },
  routingValue: {
    numberValue: value
  }
});

describe("RoutingConditions", () => {
  describe("number answers", () => {
    it("should create condition for a single number answer", () => {
      const conditions = [buildNumberAnswer(101, 30)];
      expect(new RoutingConditions(conditions)).toEqual({
        when: [
          {
            id: "answer101",
            condition: "equals",
            value: 30
          }
        ]
      });
    });

    it("should set value to null of input is empty", () => {
      const conditions = [buildNumberAnswer(101, null)];
      expect(new RoutingConditions(conditions).when[0].value).toBeNull();
    });

    it("should create condition for two number answers", () => {
      const conditions = [
        buildNumberAnswer(101, 20),
        buildNumberAnswer(102, 30)
      ];
      expect(new RoutingConditions(conditions)).toEqual({
        when: [
          {
            id: "answer101",
            condition: "equals",
            value: 20
          },
          {
            id: "answer102",
            condition: "equals",
            value: 30
          }
        ]
      });
    });

    it("should handle not equals", () => {
      const conditions = [buildNumberAnswer(101, 30, "NotEqual")];
      expect(new RoutingConditions(conditions)).toEqual({
        when: [
          {
            id: "answer101",
            condition: "not equals",
            value: 30
          }
        ]
      });
    });

    it("should handle greater than", () => {
      const conditions = [buildNumberAnswer(101, 30, "GreaterThan")];
      expect(new RoutingConditions(conditions)).toEqual({
        when: [
          {
            id: "answer101",
            condition: "greater than",
            value: 30
          }
        ]
      });
    });

    it("should handle less than", () => {
      const conditions = [buildNumberAnswer(101, 30, "LessThan")];
      expect(new RoutingConditions(conditions)).toEqual({
        when: [
          {
            id: "answer101",
            condition: "less than",
            value: 30
          }
        ]
      });
    });
  });

  describe("radio answers", () => {
    it("should build up condition for radio/checkbox answers", () => {
      expect(new RoutingConditions(radioRoutingCondition)).toEqual({
        when: [
          {
            condition: "not equals",
            id: "answer1",
            value: "No"
          },
          {
            condition: "set",
            id: "answer1"
          }
        ]
      });
    });

    it("should include additionalAnswer options if included", () => {
      const radioWithAdditionalAnswer = [
        {
          id: "2",
          comparator: "Equal",
          answer: {
            id: "1",
            type: "Radio",
            options: [
              {
                id: "1",
                label: "Yes",
                value: "yes"
              },
              {
                id: "2",
                label: "No",
                value: "no"
              },
              {
                id: "3",
                label: "Maybe",
                value: "maybe",
                additionalAnswer: { id: "4", label: "additionalAnswer" }
              }
            ]
          },
          routingValue: {
            value: ["1", "3"]
          }
        }
      ];

      expect(new RoutingConditions(radioWithAdditionalAnswer)).toEqual({
        when: [
          {
            condition: "not equals",
            id: "answer1",
            value: "No"
          },
          {
            condition: "set",
            id: "answer1"
          }
        ]
      });
    });
  });

  describe("unsupported answers", () => {
    it("should throw an error for unsupported answer types", () => {
      const conditions = [
        {
          id: "1",
          comparator: "equals",
          answer: {
            id: `101`,
            type: "TextArea"
          },
          routingValue: {
            numberValue: 0
          }
        }
      ];
      expect(() => new RoutingConditions(conditions)).toThrowError();
    });

    it("should throw an error for null/undefined answer types", () => {
      const conditions = [
        {
          id: "1",
          comparator: "equals",
          answer: {
            id: `101`,
            type: null
          },
          routingValue: {
            numberValue: 0
          }
        }
      ];
      expect(() => new RoutingConditions(conditions)).toThrowError();
    });
  });
});
