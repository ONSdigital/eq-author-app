import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import Menu, { tabTitles } from "./Menu";

import {
  destinationKey,
  EndOfQuestionnaire,
  NextPage,
  EndOfCurrentSection,
} from "constants/destinations";

const props = {
  data: {
    logicalDestinations: [
      {
        id: NextPage,
        displayName: destinationKey[NextPage],
        logicalDestination: NextPage,
      },
      {
        id: EndOfQuestionnaire,
        displayName: destinationKey[EndOfQuestionnaire],
        logicalDestination: EndOfQuestionnaire,
      },
    ],
    pages: [
      {
        id: "1",
        displayName: "Question one",
        section: [
          {
            id: "section-1",
            displayName: "Section one",
          },
        ],
      },
      {
        id: "2",
        displayName: "Question two",
        section: [
          {
            id: "section-1",
            displayName: "Section one",
          },
        ],
      },
      {
        id: "3",
        displayName: "Question three",
        section: [
          {
            id: "section-1",
            displayName: "Section one",
          },
        ],
      },
      {
        id: "4",
        displayName: "Question four",
        section: [
          {
            id: "section-1",
            displayName: "Section one",
          },
        ],
      },
    ],
    sections: [
      {
        id: "section-2",
        displayName: "Section two",
      },
      {
        id: "section-3",
        displayName: "Section three",
      },
      {
        id: "section-4",
        displayName: "Section four",
      },
    ],
  },
  isSelected: jest.fn(),
};

function setup({ data, isSelected, ...extra }) {
  const onSelected = jest.fn();
  const utils = render(
    <Menu
      data={data}
      onSelected={onSelected}
      isSelected={isSelected}
      // might not need this
      {...extra}
    />
  );

  const keyPress = (name, { key, code }) =>
    fireEvent.keyUp(utils.getByText(name), {
      key,
      code,
    });

  const keyPressId = (id, { key, code }) =>
    fireEvent.keyUp(utils.getByTestId(id), {
      key,
      code,
    });

  const click = name => fireEvent.click(utils.getByText(name));

  return {
    ...utils,
    keyPress,
    keyPressId,
    click,
    onSelected,
  };
}

function defaultSetup() {
  const utils = setup(props);
  return { ...utils };
}

describe("Destination Picker Menu", () => {
  it("should default to current section tab", () => {
    const { getByText } = defaultSetup();
    expect(getByText("Question one")).toBeVisible();
  });

  it("should show active styling for current tab", () => {
    const { getByText } = defaultSetup();
    expect(getByText(tabTitles.current)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );
  });

  it("should display question pages in 'Current section'", () => {
    const { getByText } = defaultSetup();
    expect(getByText(tabTitles.current)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );
    expect(getByText("Question one")).toBeVisible();
    expect(getByText("Question two")).toBeVisible();
    expect(getByText("Question three")).toBeVisible();
    expect(getByText("Question four")).toBeVisible();
  });

  it("should display sections in 'Later sections'", () => {
    const { queryByText, getByText, click } = defaultSetup();
    click(tabTitles.later);
    expect(getByText(tabTitles.later)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );
    expect(queryByText("Section one")).toBeFalsy();
    expect(getByText("Section two")).toBeVisible();
    expect(getByText("Section three")).toBeVisible();
    expect(getByText("Section four")).toBeVisible();
  });

  it("should display 'Other destinations' options", () => {
    const { getByText, click } = defaultSetup();
    click(tabTitles.other);
    expect(getByText(tabTitles.other)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );
    expect(getByText(destinationKey[NextPage])).toBeVisible();
    expect(getByText(destinationKey[EndOfCurrentSection])).toBeVisible();
    expect(getByText(destinationKey[EndOfQuestionnaire])).toBeVisible();
  });

  it("should display only display 'Current section' and 'Other destinations' tab when missing destinations in the 'Later sections'", () => {});

  it("should be able to change destination tabs with Space or enter", () => {
    const { getByText, keyPress } = defaultSetup();

    expect(getByText(tabTitles.current)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );

    // doesn't change with other keyDown
    keyPress(tabTitles.later, { key: "Escape", code: "Escape" });
    expect(getByText(tabTitles.current)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );

    // changes with Enter
    keyPress(tabTitles.later, { key: "Enter", code: "Enter" });
    expect(getByText(tabTitles.later)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );

    // changes with Space
    keyPress(tabTitles.other, { key: " ", code: "Space" });
    expect(getByText(tabTitles.other)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );
  });

  it("should be able to change destination tabs with click", () => {
    const { getByText, click } = defaultSetup();

    click(tabTitles.later);
    expect(getByText(tabTitles.later)).toHaveStyleRule(
      "background-color",
      "#f3f3f3"
    );
  });

  it("should be able to select destination with Enter", () => {
    const { onSelected, keyPress } = defaultSetup();

    keyPress("Question two", { key: "Enter", code: "Enter" });
    expect(onSelected).toHaveBeenCalledTimes(1);
    expect(onSelected).toHaveBeenCalledWith(props.data.pages[1]);
  });

  it("should be able to select destination with Space", () => {
    const { onSelected, keyPress } = defaultSetup();

    keyPress("Question three", { key: " ", code: "Space" });
    expect(onSelected).toHaveBeenCalledTimes(1);
    expect(onSelected).toHaveBeenCalledWith(props.data.pages[2]);
  });

  it("should be able to select destination with click", () => {
    const { onSelected, click } = defaultSetup();

    click("Question two");
    expect(onSelected).toHaveBeenCalledTimes(1);
    expect(onSelected).toHaveBeenCalledWith(props.data.pages[1]);
  });

  it("should return last question page if clicking 'End of current section'", () => {
    const { onSelected, click } = defaultSetup();

    click("Other destinations");
    click(destinationKey[EndOfCurrentSection]);
    expect(onSelected).toHaveBeenCalledTimes(1);
    expect(onSelected).toHaveBeenCalledWith({
      ...props.data.pages[3],
      displayName: destinationKey[EndOfCurrentSection],
    });
  });
});

//   describe("Picker", () => {
//     let props;
//     beforeEach(() => {
//       props = {
//         data: [
//           {
//             id: "839f1e3b-9ed0-4eaf-afae-24bcff9dda67",
//             displayName: "Untitled Section",
//             pages: [
//               {
//                 id: "2d4404f1-a569-4977-af16-f433eb69193b",
//                 displayName: "asdf",
//                 section: {
//                   id: "839f1e3b-9ed0-4eaf-afae-24bcff9dda67",
//                   displayName: "Untitled Section",
//                   __typename: "Section",
//                 },
//                 __typename: "QuestionPage",
//               },
//               {
//                 id: "4513069f-b4e4-44e9-8e15-f5dbff8fa030",
//                 displayName: "Untitled Page",
//                 section: {
//                   id: "839f1e3b-9ed0-4eaf-afae-24bcff9dda67",
//                   displayName: "Untitled Section",
//                   __typename: "Section",
//                 },
//                 __typename: "QuestionPage",
//               },
//             ],
//           },
//         ],
//         onSelected: jest.fn(),
//         isSelected: jest.fn(),
//       };
//     });
//     it("should set default tab to sections when there is more than one destination", () => {
//       props.data[1] = {
//         id: "a3d7bbe4-e0d2-4d51-99eb-208bf56b7812",
//         displayName: "Untitled Section",
//         pages: [
//           {
//             id: "a3d7bbe4-e0d2-4d51-99eb-208bf56b7812",
//             displayName: "Untitled Page",
//             __typename: "Section",
//           },
//         ],
//         __typename: "Section",
//       };
//       const { getByText } = render(<DestinationPicker {...props} />);
//       const sectionsTabButton = getByText("Sections").closest("label");
//       const questionsTabButton = getByText("Questions").closest("label");
//       expect(sectionsTabButton).toHaveAttribute("tabindex", "");
//       expect(questionsTabButton).toHaveAttribute("tabindex", "0");
//     });
//     it("should set tab to questions when there is one destination or less", () => {
//       const { getByText } = render(<DestinationPicker {...props} />);
//       const sectionsTabButton = getByText("Sections").closest("label");
//       const questionsTabButton = getByText("Questions").closest("label");
//       expect(sectionsTabButton).toHaveAttribute("tabindex", "0");
//       expect(questionsTabButton).toHaveAttribute("tabindex", "");
//     });
//     it("should show destination end with header when question tab is open", () => {
//       const { queryAllByText } = render(<DestinationPicker {...props} />);
//       const elements = queryAllByText(/end of questionnaire$/i);
//       expect(elements).toHaveLength(2);
//     });
//     // it("should switch between questions and sections when tab button is clicked", () => {
//     //   const { getByText } = render(<DestinationPicker {...props} />);
//     //   const sectionsTabButton = getByText("Sections").closest("label");
//     //   expect(sectionsTabButton).toHaveAttribute("tabindex", "0");
//     //   fireEvent.click(sectionsTabButton);
//     //   expect(sectionsTabButton).toHaveAttribute("tabindex", "");
//     // });
//   });
//   describe("FlatSectionMenu", () => {
//     let props;
//     beforeEach(() => {
//       props = {
//         data: [
//           {
//             id: "9278b797-cc3d-42f8-a863-95b33ecdfef9",
//             displayName: "Section1",
//             pages: [
//               {
//                 id: "4c031560-6e24-4805-90d3-883040a9c664",
//                 displayName: "Question1",
//                 section: {
//                   id: "9278b797-cc3d-42f8-a863-95b33ecdfef9",
//                   displayName: "Section1",
//                   __typename: "Section",
//                 },
//                 __typename: "QuestionPage",
//               },
//             ],
//           },
//           {
//             id: "b8f78e2a-5034-4a9a-ab01-d1192adff0a6",
//             displayName: "Section2",
//             pages: [
//               {
//                 id: "b8f78e2a-5034-4a9a-ab01-d1192adff0a6",
//                 displayName: "Question2",
//                 __typename: "Section",
//               },
//             ],
//             __typename: "Section",
//           },
//         ],
//         onSelected: jest.fn(),
//         isSelected: jest.fn(false),
//       };
//     });
//     it("should render flat section menu items", () => {
//       const { getByText } = render(<FlatSectionMenu {...props} />);
//       getByText(props.data[0].displayName);
//       getByText(props.data[0].pages[0].displayName);
//       getByText(props.data[1].displayName);
//       getByText(props.data[1].pages[0].displayName);
//     });
//   });
//   describe("Menu", () => {
//     let props;
//     beforeEach(() => {
//       props = {
//         data: [{ id: "123", displayName: "Section 1" }],
//         onSelected: jest.fn(),
//         isSelected: jest.fn(false),
//       };
//     });
//     it("should handle empty data", () => {
//       props.data = null;
//       render(<Menu {...props} />);
//     });
//     it("should fire onSelected when enter key is pressed", () => {
//       const { getByText } = render(<Menu {...props} />);
//       const element = getByText("Section 1");
//       fireEvent.keyUp(element, { keyCode: 13 });
//       expect(props.onSelected).toHaveBeenCalledWith(props.data[0]);
//     });
//     it("should not fire onSelected when other key is pressed", () => {
//       const { getByText } = render(<Menu {...props} />);
//       const element = getByText("Section 1");
//       fireEvent.keyUp(element, { keyCode: 14 });
//       expect(props.onSelected).not.toHaveBeenCalledWith(props.data[0]);
//     });
//     it("should fire onSelected with section when clicked", () => {
//       const { getByText } = render(<Menu {...props} />);
//       const element = getByText("Section 1");
//       fireEvent.click(element);
//       expect(props.onSelected).toHaveBeenCalledWith(props.data[0]);
//     });
//   });
//   describe("SectionMenu", () => {
//     let props;
//     beforeEach(() => {
//       props = {
//         data: [
//           {
//             id: "9278b797-cc3d-42f8-a863-95b33ecdfef9",
//             displayName: "Section1",
//             pages: [
//               {
//                 id: "4c031560-6e24-4805-90d3-883040a9c664",
//                 displayName: "Question1",
//                 section: {
//                   id: "9278b797-cc3d-42f8-a863-95b33ecdfef9",
//                   displayName: "Section1",
//                   __typename: "Section",
//                 },
//                 __typename: "QuestionPage",
//               },
//             ],
//           },
//           {
//             id: "b8f78e2a-5034-4a9a-ab01-d1192adff0a6",
//             displayName: "Section2",
//             pages: [
//               {
//                 id: "b8f78e2a-5034-4a9a-ab01-d1192adff0a6",
//                 displayName: "Question2",
//                 __typename: "Section",
//               },
//             ],
//             __typename: "Section",
//           },
//         ],
//         onSelected: jest.fn(),
//         isSelected: jest.fn(false),
//       };
//     });
//     it("should select first section when no items selected", () => {
//       const { getByText } = render(<SectionMenu {...props} />);
//       const section1Button = getByText("Section1");
//       const section2Button = getByText("Section2");
//       expect(section1Button).toHaveAttribute("aria-selected", "true");
//       expect(section2Button).toHaveAttribute("aria-selected", "false");
//     });
//     it("should highlight the selected section", () => {
//       const { getByText } = render(<SectionMenu {...props} />);
//       const section1Button = getByText("Section1");
//       const section2Button = getByText("Section2");
//       fireEvent.click(section2Button);
//       expect(section1Button).toHaveAttribute("aria-selected", "false");
//       expect(section2Button).toHaveAttribute("aria-selected", "true");
//     });
//   });
//   describe("SubMenu", () => {
//     let props;
//     beforeEach(() => {
//       props = {
//         pages: [
//           {
//             id: "page-id-1",
//             displayName: "Question1",
//             __typename: "QuestionPage",
//           },
//           {
//             id: "page-id-2",
//             displayName: "Question2",
//             __typename: "QuestionPage",
//           },
//         ],
//         onSelected: jest.fn(),
//         isSelected: jest.fn(),
//       };
//     });
//     it("should fire onSelected with page when clicked", () => {
//       const { getByText } = render(<SubMenu {...props} />);
//       const page = props.pages[0];
//       const element = getByText(page.displayName);
//       fireEvent.click(element);
//       expect(props.onSelected).toHaveBeenCalledWith(page);
//     });
//     it("should fire onSelected with page when enter pressed", () => {
//       const { getByText } = render(<SubMenu {...props} />);
//       const page = props.pages[0];
//       const element = getByText(page.displayName);
//       fireEvent.keyUp(element, { keyCode: 13 });
//       expect(props.onSelected).toHaveBeenCalledWith(page);
//     });
//     it("should not fire onSelected with page when other key pressed", () => {
//       const { getByText } = render(<SubMenu {...props} />);
//       const page = props.pages[0];
//       const element = getByText(page.displayName);
//       fireEvent.keyUp(element, { keyCode: 14 });
//       expect(props.onSelected).not.toHaveBeenCalledWith(page);
//     });
//     it("should display end destination if page id is EndOfQuestionnaire", () => {
//       props.pages[0] = { id: "EndOfQuestionnaire" };
//       const { getByText } = render(<SubMenu {...props} />);
//       getByText("End of questionnaire");
//     });
//   });
//   describe("DestinationEnd", () => {
//     let props;
//     beforeEach(() => {
//       props = {
//         onSelected: jest.fn(),
//         isSelected: jest.fn(),
//         isDisabled: jest.fn(false),
//         hideHeader: true,
//       };
//     });
//     it("should fire onSelected with config when clicked", () => {
//       const { getByText } = render(<DestinationEnd {...props} />);
//       const element = getByText("End of questionnaire");
//       fireEvent.click(element);
//       expect(props.onSelected).toHaveBeenCalledWith(destinationConfig);
//     });
//     it("should fire onSelected when enter key is pressed", () => {
//       const { getByText } = render(<DestinationEnd {...props} />);
//       const element = getByText("End of questionnaire");
//       fireEvent.keyUp(element, { keyCode: 13 });
//       expect(props.onSelected).toHaveBeenCalledWith(destinationConfig);
//     });
//     it("should not fire onSelected when other key is pressed", () => {
//       const { getByText } = render(<DestinationEnd {...props} />);
//       const element = getByText("End of questionnaire");
//       fireEvent.keyUp(element, { keyCode: 14 });
//       expect(props.onSelected).not.toHaveBeenCalledWith(destinationConfig);
//     });
//     it("should show the header bar when not passed hideHeader", () => {
//       props.hideHeader = false;
//       const { queryAllByText } = render(<DestinationEnd {...props} />);
//       const elements = queryAllByText(/end of questionnaire$/i);
//       expect(elements).toHaveLength(2);
//     });
//   });
