import React from "react";
import { shallow } from "enzyme";

import AvailablePipingContentQuery from "components/RichTextEditor/AvailablePipingContentQuery";

import {
  Menu,
  MenuButton,
  UnwrappedPipingMenu,
} from "components/RichTextEditor/PipingMenu";

describe("PipingMenu", () => {
  let handleItemChosen, answerData, metadataData;

  const render = (props = {}) => {
    return shallow(
      <Menu
        match={createMatch("1", "1", "1")}
        onItemChosen={handleItemChosen}
        answerData={answerData}
        metadataData={metadataData}
        entityName={"section"}
        canFocus
        {...props}
      />
    );
  };

  const createMatch = (questionnaireId, sectionId, pageId) => ({
    params: {
      questionnaireId,
      sectionId,
      pageId,
    },
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
            displayName: "Section 1",
          },
        },
      },
      {
        id: "2",
        displayName: "Answer 2",
        page: {
          id: "1",
          displayName: "Page 1",
          section: {
            id: "1",
            displayName: "Section 1",
          },
        },
      },
      {
        id: "3",
        displayName: "3",
        page: {
          id: "2",
          displayName: "Page 2",
          section: {
            id: "2",
            displayName: "Section 2",
          },
        },
      },
    ];

    metadataData = [
      {
        id: "1",
        displayName: "Metadata",
      },
    ];
  });

  it("should render", () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as disabled when disabled", () => {
    const wrapper = render({
      disabled: true,
    });
    expect(wrapper.find(MenuButton).prop("disabled")).toBe(true);
  });

  it("should render as disabled when loading", () => {
    const wrapper = render({
      loading: true,
    });
    expect(wrapper.find(MenuButton).prop("disabled")).toBe(true);
  });

  it("should render as disabled when there is no answerData and metadataData", () => {
    const wrapper = render({
      answerData: null,
      metadataData: null,
    });
    expect(wrapper.find(MenuButton).prop("disabled")).toBe(true);
  });

  it("should render as disabled when it does not have focus", () => {
    const wrapper = shallow(
      <UnwrappedPipingMenu
        match={{
          params: {
            questionnaireId: "4",
            sectionId: "3",
            pageId: "2",
            confirmationId: "1",
          },
        }}
        canFocus={false}
      />
    );

    expect(wrapper.find(MenuButton).prop("disabled")).toBe(true);
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
      displayName: "item",
    });
    expect(handleItemChosen).toHaveBeenCalledWith({
      id: 1,
      displayName: "item",
    });
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(false);
  });

  it("should close the picker on picker close event", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button']").simulate("click");
    wrapper.find("[data-test='picker']").simulate("close");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(false);
  });

  it("should pick the data depending on the page location", () => {
    const entities = [
      {
        name: "questionConfirmation",
        params: {
          questionnaireId: "4",
          sectionId: "3",
          pageId: "2",
          confirmationId: "1",
        },
      },
      {
        name: "page",
        params: {
          questionnaireId: "4",
          sectionId: "3",
          pageId: "2",
        },
      },
      {
        name: "section",
        params: {
          questionnaireId: "4",
          sectionId: "3",
        },
      },
    ];

    entities.forEach(({ name, params }) => {
      const match = {
        params,
      };
      const data = {
        [name]: {
          pageType: "QuestionPage",
          availablePipingAnswers: [
            {
              id: "1",
              displayName: "Answer 1",
              page: {
                id: "1",
                displayName: "Page 1",
                section: {
                  id: "1",
                  displayName: "Section 1",
                },
              },
            },
          ],
          availablePipingMetadata: [
            {
              id: "1",
              alias: "Metadata",
            },
          ],
        },
      };

      const wrapper = shallow(
        <UnwrappedPipingMenu
          match={match}
          canFocus
          entityName={name}
          entity={data[name]}
        />
      );
      const result = wrapper.find(AvailablePipingContentQuery).prop("children")(
        {
          data,
          onItemChosen: jest.fn(),
        }
      );

      expect(result.props).toMatchObject({
        answerData: [
          {
            id: "1",
            displayName: "Section 1",
            pages: [
              {
                id: "1",
                displayName: "Page 1",
                answers: [{ id: "1", displayName: "Answer 1" }],
              },
            ],
          },
        ],
        metadataData: [
          {
            id: "1",
            alias: "Metadata",
          },
        ],
      });
    });
  });
});
