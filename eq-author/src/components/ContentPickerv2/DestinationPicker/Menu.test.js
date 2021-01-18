import React from "react";
import { render } from "tests/utils/rtl";

import Menu from "./Menu";

describe("Destination Picker", () => {
  describe("Picker", () => {
    let props;
    beforeEach(() => {
      props = {
        data: [
          {
            id: "839f1e3b-9ed0-4eaf-afae-24bcff9dda67",
            displayName: "Untitled Section",
            pages: [
              {
                id: "2d4404f1-a569-4977-af16-f433eb69193b",
                displayName: "asdf",
                section: {
                  id: "839f1e3b-9ed0-4eaf-afae-24bcff9dda67",
                  displayName: "Untitled Section",
                  __typename: "Section",
                },
                __typename: "QuestionPage",
              },
              {
                id: "4513069f-b4e4-44e9-8e15-f5dbff8fa030",
                displayName: "Untitled Page",
                section: {
                  id: "839f1e3b-9ed0-4eaf-afae-24bcff9dda67",
                  displayName: "Untitled Section",
                  __typename: "Section",
                },
                __typename: "QuestionPage",
              },
            ],
          },
        ],
        onSelected: jest.fn(),
        isSelected: jest.fn(),
      };
    });

    it("should set default tab to sections when there is more than one destination", () => {
      props.data[1] = {
        id: "a3d7bbe4-e0d2-4d51-99eb-208bf56b7812",
        displayName: "Untitled Section",
        pages: [
          {
            id: "a3d7bbe4-e0d2-4d51-99eb-208bf56b7812",
            displayName: "Untitled Page",
            __typename: "Section",
          },
        ],
        __typename: "Section",
      };
      const { getByText } = render(<DestinationPicker {...props} />);
      const sectionsTabButton = getByText("Sections").closest("label");
      const questionsTabButton = getByText("Questions").closest("label");

      expect(sectionsTabButton).toHaveAttribute("tabindex", "");
      expect(questionsTabButton).toHaveAttribute("tabindex", "0");
    });

    it("should set tab to questions when there is one destination or less", () => {
      const { getByText } = render(<DestinationPicker {...props} />);
      const sectionsTabButton = getByText("Sections").closest("label");
      const questionsTabButton = getByText("Questions").closest("label");

      expect(sectionsTabButton).toHaveAttribute("tabindex", "0");
      expect(questionsTabButton).toHaveAttribute("tabindex", "");
    });

    it("should show destination end with header when question tab is open", () => {
      const { queryAllByText } = render(<DestinationPicker {...props} />);
      const elements = queryAllByText(/end of questionnaire$/i);
      expect(elements).toHaveLength(2);
    });

    // it("should switch between questions and sections when tab button is clicked", () => {
    //   const { getByText } = render(<DestinationPicker {...props} />);
    //   const sectionsTabButton = getByText("Sections").closest("label");

    //   expect(sectionsTabButton).toHaveAttribute("tabindex", "0");
    //   fireEvent.click(sectionsTabButton);
    //   expect(sectionsTabButton).toHaveAttribute("tabindex", "");
    // });
  });

  describe("FlatSectionMenu", () => {
    let props;
    beforeEach(() => {
      props = {
        data: [
          {
            id: "9278b797-cc3d-42f8-a863-95b33ecdfef9",
            displayName: "Section1",
            pages: [
              {
                id: "4c031560-6e24-4805-90d3-883040a9c664",
                displayName: "Question1",
                section: {
                  id: "9278b797-cc3d-42f8-a863-95b33ecdfef9",
                  displayName: "Section1",
                  __typename: "Section",
                },
                __typename: "QuestionPage",
              },
            ],
          },
          {
            id: "b8f78e2a-5034-4a9a-ab01-d1192adff0a6",
            displayName: "Section2",
            pages: [
              {
                id: "b8f78e2a-5034-4a9a-ab01-d1192adff0a6",
                displayName: "Question2",
                __typename: "Section",
              },
            ],
            __typename: "Section",
          },
        ],
        onSelected: jest.fn(),
        isSelected: jest.fn(false),
      };
    });

    it("should render flat section menu items", () => {
      const { getByText } = render(<FlatSectionMenu {...props} />);
      getByText(props.data[0].displayName);
      getByText(props.data[0].pages[0].displayName);
      getByText(props.data[1].displayName);
      getByText(props.data[1].pages[0].displayName);
    });
  });

  describe("Menu", () => {
    let props;
    beforeEach(() => {
      props = {
        data: [{ id: "123", displayName: "Section 1" }],
        onSelected: jest.fn(),
        isSelected: jest.fn(false),
      };
    });

    it("should handle empty data", () => {
      props.data = null;
      render(<Menu {...props} />);
    });

    it("should fire onSelected when enter key is pressed", () => {
      const { getByText } = render(<Menu {...props} />);
      const element = getByText("Section 1");
      fireEvent.keyUp(element, { keyCode: 13 });
      expect(props.onSelected).toHaveBeenCalledWith(props.data[0]);
    });

    it("should not fire onSelected when other key is pressed", () => {
      const { getByText } = render(<Menu {...props} />);
      const element = getByText("Section 1");
      fireEvent.keyUp(element, { keyCode: 14 });
      expect(props.onSelected).not.toHaveBeenCalledWith(props.data[0]);
    });

    it("should fire onSelected with section when clicked", () => {
      const { getByText } = render(<Menu {...props} />);
      const element = getByText("Section 1");
      fireEvent.click(element);
      expect(props.onSelected).toHaveBeenCalledWith(props.data[0]);
    });
  });

  describe("SectionMenu", () => {
    let props;

    beforeEach(() => {
      props = {
        data: [
          {
            id: "9278b797-cc3d-42f8-a863-95b33ecdfef9",
            displayName: "Section1",
            pages: [
              {
                id: "4c031560-6e24-4805-90d3-883040a9c664",
                displayName: "Question1",
                section: {
                  id: "9278b797-cc3d-42f8-a863-95b33ecdfef9",
                  displayName: "Section1",
                  __typename: "Section",
                },
                __typename: "QuestionPage",
              },
            ],
          },
          {
            id: "b8f78e2a-5034-4a9a-ab01-d1192adff0a6",
            displayName: "Section2",
            pages: [
              {
                id: "b8f78e2a-5034-4a9a-ab01-d1192adff0a6",
                displayName: "Question2",
                __typename: "Section",
              },
            ],
            __typename: "Section",
          },
        ],
        onSelected: jest.fn(),
        isSelected: jest.fn(false),
      };
    });

    it("should select first section when no items selected", () => {
      const { getByText } = render(<SectionMenu {...props} />);

      const section1Button = getByText("Section1");
      const section2Button = getByText("Section2");

      expect(section1Button).toHaveAttribute("aria-selected", "true");
      expect(section2Button).toHaveAttribute("aria-selected", "false");
    });

    it("should highlight the selected section", () => {
      const { getByText } = render(<SectionMenu {...props} />);

      const section1Button = getByText("Section1");
      const section2Button = getByText("Section2");

      fireEvent.click(section2Button);

      expect(section1Button).toHaveAttribute("aria-selected", "false");
      expect(section2Button).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("SubMenu", () => {
    let props;
    beforeEach(() => {
      props = {
        pages: [
          {
            id: "page-id-1",
            displayName: "Question1",
            __typename: "QuestionPage",
          },
          {
            id: "page-id-2",
            displayName: "Question2",
            __typename: "QuestionPage",
          },
        ],
        onSelected: jest.fn(),
        isSelected: jest.fn(),
      };
    });

    it("should fire onSelected with page when clicked", () => {
      const { getByText } = render(<SubMenu {...props} />);
      const page = props.pages[0];
      const element = getByText(page.displayName);
      fireEvent.click(element);
      expect(props.onSelected).toHaveBeenCalledWith(page);
    });

    it("should fire onSelected with page when enter pressed", () => {
      const { getByText } = render(<SubMenu {...props} />);
      const page = props.pages[0];
      const element = getByText(page.displayName);
      fireEvent.keyUp(element, { keyCode: 13 });
      expect(props.onSelected).toHaveBeenCalledWith(page);
    });

    it("should not fire onSelected with page when other key pressed", () => {
      const { getByText } = render(<SubMenu {...props} />);
      const page = props.pages[0];
      const element = getByText(page.displayName);
      fireEvent.keyUp(element, { keyCode: 14 });
      expect(props.onSelected).not.toHaveBeenCalledWith(page);
    });

    it("should display end destination if page id is EndOfQuestionnaire", () => {
      props.pages[0] = { id: "EndOfQuestionnaire" };
      const { getByText } = render(<SubMenu {...props} />);
      getByText("End of questionnaire");
    });
  });

  describe("DestinationEnd", () => {
    let props;
    beforeEach(() => {
      props = {
        onSelected: jest.fn(),
        isSelected: jest.fn(),
        isDisabled: jest.fn(false),
        hideHeader: true,
      };
    });

    it("should fire onSelected with config when clicked", () => {
      const { getByText } = render(<DestinationEnd {...props} />);
      const element = getByText("End of questionnaire");
      fireEvent.click(element);
      expect(props.onSelected).toHaveBeenCalledWith(destinationConfig);
    });

    it("should fire onSelected when enter key is pressed", () => {
      const { getByText } = render(<DestinationEnd {...props} />);
      const element = getByText("End of questionnaire");
      fireEvent.keyUp(element, { keyCode: 13 });
      expect(props.onSelected).toHaveBeenCalledWith(destinationConfig);
    });

    it("should not fire onSelected when other key is pressed", () => {
      const { getByText } = render(<DestinationEnd {...props} />);
      const element = getByText("End of questionnaire");
      fireEvent.keyUp(element, { keyCode: 14 });
      expect(props.onSelected).not.toHaveBeenCalledWith(destinationConfig);
    });

    it("should show the header bar when not passed hideHeader", () => {
      props.hideHeader = false;
      const { queryAllByText } = render(<DestinationEnd {...props} />);
      const elements = queryAllByText(/end of questionnaire$/i);
      expect(elements).toHaveLength(2);
    });
  });
});
