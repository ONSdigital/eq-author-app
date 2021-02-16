import React from "react";
import { mount } from "enzyme";

describe("withAnswerValidation", () => {
  afterEach(() => {
    jest.resetModules();
  });

  const getWithAnswerValidationWithContext = (answer) => {
    jest.doMock("./ValidationContext", () => ({
      Consumer: ({ children }) => children({ answer }),
    }));
    return require("./withAnswerValidation").default;
  };

  const Component = () => <div />;

  it("should pass down the validation requested", () => {
    const answer = {
      another: "value",
      validation: {
        exampleValidation: { foo: "bar" },
      },
    };
    const withAnswerValidation = getWithAnswerValidationWithContext(answer);
    const WrappedComponent = withAnswerValidation("exampleValidation")(
      Component
    );
    const wrapper = mount(<WrappedComponent hello="world" />);
    expect(wrapper.find("Component").props()).toMatchObject({
      exampleValidation: {
        foo: "bar",
      },
      hello: "world",
      answer: {
        another: "value",
      },
    });
  });
});
