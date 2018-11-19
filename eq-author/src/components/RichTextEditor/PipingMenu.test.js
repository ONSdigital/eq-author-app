import React from "react";
import {
  Menu as PipingMenu,
  MenuButton as PipingMenuButton
} from "./PipingMenu";
import { shallow } from "enzyme";

describe("PipingMenu", () => {
  let handleItemChosen, answerData, metadataData;

  const render = (props = {}) => {
    return shallow(
      <PipingMenu
        match={createMatch("1", "1", "1")}
        onItemChosen={handleItemChosen}
        answerData={answerData}
        metadataData={metadataData}
        {...props}
      />
    );
  };

  const createMatch = (questionnaireId, sectionId, pageId) => ({
    params: {
      questionnaireId,
      sectionId,
      pageId
    }
  });

  beforeEach(() => {
    handleItemChosen = jest.fn();
    answerData = [
      {
        id: "1",
        displayName: "Answer 1",
        page: {
          id: "1",
          displayName: "Page 1",
          section: {
            id: "1",
            displayName: "Section 1"
          }
        }
      },
      {
        id: "2",
        displayName: "Answer 2",
        page: {
          id: "1",
          displayName: "Page 1",
          section: {
            id: "1",
            displayName: "Section 1"
          }
        }
      },
      {
        id: "3",
        displayName: "3",
        page: {
          id: "2",
          displayName: "Page 2",
          section: {
            id: "2",
            displayName: "Section 2"
          }
        }
      }
    ];

    metadataData = [
      {
        id: "1",
        displayName: "Metadata"
      }
    ];
  });

  it("should render", () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as disabled when disabled", () => {
    const wrapper = render({
      disabled: true
    });
    expect(wrapper.find(PipingMenuButton).prop("disabled")).toBe(true);
  });

  it("should render as disabled when loading", () => {
    const wrapper = render({
      loading: true
    });
    expect(wrapper.find(PipingMenuButton).prop("disabled")).toBe(true);
  });

  it("should render as disabled when there is no answerData and metadataData", () => {
    const wrapper = render({
      answerData: null,
      metadataData: null
    });
    expect(wrapper.find(PipingMenuButton).prop("disabled")).toBe(true);
  });

  it("should open the picker when clicked", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button']").simulate("click");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(true);
  });

  it("should call onItemChosen and close the picker when something is chosen", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button']").simulate("click");
    wrapper.find("[data-test='picker']").simulate("submit", {
      id: 1,
      displayName: "item"
    });
    expect(handleItemChosen).toHaveBeenCalledWith({
      id: 1,
      displayName: "item"
    });
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(false);
  });

  it("should close the picker on picker close event", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button']").simulate("click");
    wrapper.find("[data-test='picker']").simulate("close");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(false);
  });
});
