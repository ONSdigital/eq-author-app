import React from "react";
import { shallow } from "enzyme";

import { UnwrappedEditor as Editor } from "./Editor";

describe("Editor", () => {
  describe("Editor Component", () => {
    let mockHandlers;

    const defaultProps = {
      confirmation: {
        id: "1",
        displayName: "Confirmation name",
        title: "My first confirmation",
        qCode: "",
        page: {
          id: "1",
          displayName: "My question",
          answers: [],
        },
        positive: {
          id: "1",
          label: "Positive label",
          description: "Positive description",
          validationErrorInfo: [],
        },
        negative: {
          id: "2",
          label: "Negative label",
          description: "Negative description",
          validationErrorInfo: [],
        },
      },
    };

    const render = (props) =>
      shallow(<Editor {...mockHandlers} {...defaultProps} {...props} />);

    beforeEach(() => {
      mockHandlers = {
        onUpdate: jest.fn(),
        onChange: jest.fn(),
        getValidationError: jest.fn(),
      };
    });

    it("should render", () => {
      expect(render()).toMatchSnapshot();
    });

    it("should autoFocus the title when there is not one", () => {
      expect(
        render({
          confirmation: {
            ...defaultProps.confirmation,
            title: null,
          },
        })
      ).toMatchSnapshot();
    });

    it("should call change and pass update as a call back when the title changes", () => {
      const wrapper = render();

      wrapper
        .find(`[data-test="title-input"]`)
        .simulate("update", "some change");
      expect(mockHandlers.onChange).toHaveBeenCalledWith(
        "some change",
        mockHandlers.onUpdate
      );
    });

    it("should pass down the onChange to the positive option", () => {
      const wrapper = render();

      wrapper
        .find(`[data-test="positive-input"]`)
        .simulate("change", "positive change");
      expect(mockHandlers.onChange).toHaveBeenCalledWith("positive change");
    });

    it("should pass down the onUpdate to the positive option", () => {
      const wrapper = render();

      wrapper
        .find(`[data-test="positive-input"]`)
        .simulate("update", "positive update");
      expect(mockHandlers.onUpdate).toHaveBeenCalledWith("positive update");
    });

    it("should pass down the onChange to the negative option", () => {
      const wrapper = render();

      wrapper
        .find(`[data-test="negative-input"]`)
        .simulate("change", "negative change");
      expect(mockHandlers.onChange).toHaveBeenCalledWith("negative change");
    });

    it("should pass down the onUpdate to the negative option", () => {
      const wrapper = render();

      wrapper
        .find(`[data-test="negative-input"]`)
        .simulate("update", "negative update");
      expect(mockHandlers.onUpdate).toHaveBeenCalledWith("negative update");
    });
  });
});
