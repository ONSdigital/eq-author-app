import React from "react";
import { shallow } from "enzyme";
import ContentPicker from "./ContentPicker";
import generateMockPiping from "tests/utils/generateMockPiping";

const SECTION_PICKER_SELECTOR = "[data-test='section-picker']";
const PAGE_PICKER_SELECTOR = "[data-test='page-picker']";
const ANSWER_PICKER_SELECTOR = "[data-test='answer-picker']";

describe("Content Picker", () => {
  let onSubmit;
  let onClose;

  const config = [
    {
      id: "section",
      title: "Section",
      childKey: "pages"
    },
    {
      id: "page",
      title: "Question",
      childKey: "answers"
    },
    {
      id: "answer",
      title: "Answer"
    }
  ];
  const createWrapper = (props, render = shallow) => {
    return render(
      <ContentPicker
        onSubmit={onSubmit}
        onClose={onClose}
        config={config}
        {...props}
      />
    );
  };

  beforeEach(() => {
    onSubmit = jest.fn();
    onClose = jest.fn();
  });

  it("should render full content picker", () => {
    const wrapper = createWrapper({ data: generateMockPiping(1, 1, 1) });
    expect(wrapper).toMatchSnapshot();
  });

  describe("contentPicker States", () => {
    it("should start with disabled page and answer picker", () => {
      const wrapper = createWrapper({ data: generateMockPiping(1, 1, 1) });
      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("disabled")).toBe(true);
      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("disabled")).toBe(true);
    });

    it("should start open when there is only one level", () => {
      const oneLevelData = [
        { id: "1", displayName: "Item 1" },
        { id: "1", displayName: "Item 2" }
      ];
      const oneLevelConfig = [{ id: "oneLevel", title: "Item" }];
      const wrapper = createWrapper({
        data: oneLevelData,
        config: oneLevelConfig
      });
      expect(wrapper.find("[data-test='oneLevel-picker']").prop("open")).toBe(
        true
      );
    });

    it("when the 1st title is open the 2nd and 3rd should be hidden", () => {
      const wrapper = createWrapper({ data: generateMockPiping(1, 1, 1) });

      wrapper.find(SECTION_PICKER_SELECTOR).simulate("titleClick");

      expect(wrapper.find(SECTION_PICKER_SELECTOR).prop("open")).toBe(true);
      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("hidden")).toBe(true);
      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("hidden")).toBe(true);
    });

    it("when the 2nd title is open, 1st should be selected 3rd should be hidden", () => {
      const wrapper = createWrapper({ data: generateMockPiping(1, 1, 1) });

      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", {
        id: "Section 1",
        displayName: "Section 1",
        pages: []
      });

      expect(wrapper.find(SECTION_PICKER_SELECTOR).prop("selected")).toBe(true);
      expect(wrapper.find(SECTION_PICKER_SELECTOR).prop("title")).toBe(
        "Section: Section 1"
      );
      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("open")).toBe(true);
      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("hidden")).toBe(true);
    });

    it("when the 3nd title is open, 1st and 2nd should be selected", () => {
      const wrapper = createWrapper({ data: generateMockPiping(1, 1, 1) });
      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", {
        id: "Section 1",
        displayName: "Section 1",
        pages: []
      });

      let pagePicker = wrapper.find(PAGE_PICKER_SELECTOR);
      pagePicker.simulate("optionClick", {
        id: "Page 1",
        displayName: "Page 1",
        answers: []
      });

      expect(wrapper.find(SECTION_PICKER_SELECTOR).prop("selected")).toBe(true);
      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("selected")).toBe(true);
      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("title")).toBe(
        "Question: Page 1"
      );
      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("open")).toBe(true);
    });

    it("should not change the title when the last level is chosen", () => {
      const wrapper = createWrapper({ data: generateMockPiping(1, 1, 1) });
      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", {
        id: "Section 1",
        displayName: "Section 1",
        pages: []
      });

      let pagePicker = wrapper.find(PAGE_PICKER_SELECTOR);
      pagePicker.simulate("optionClick", {
        id: "Page 1",
        displayName: "Page 1",
        answers: []
      });

      wrapper.find(ANSWER_PICKER_SELECTOR).simulate("optionClick", {
        id: "Answer 1",
        displayName: "Answer 1"
      });

      expect(wrapper.find(SECTION_PICKER_SELECTOR).prop("selected")).toBe(true);
      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("selected")).toBe(true);
      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("open")).toBe(true);
      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("title")).toBe("Answer");
    });

    it("should close the picker when the title is clicked a second time and there is data and re-open the next one to enter", () => {
      const wrapper = createWrapper({ data: generateMockPiping(1, 1, 1) });
      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", {
        id: "Section 1",
        displayName: "Section 1",
        pages: []
      });
      let pagePicker = wrapper.find(PAGE_PICKER_SELECTOR);
      pagePicker.simulate("optionClick", {
        id: "Page 1",
        displayName: "Page 1",
        answers: []
      });

      // open
      wrapper.find(SECTION_PICKER_SELECTOR).simulate("titleClick");
      // close
      wrapper.find(SECTION_PICKER_SELECTOR).simulate("titleClick");

      expect(wrapper.find(SECTION_PICKER_SELECTOR).prop("open")).toBe(false);
      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("open")).toBe(true);
    });

    it("should not be able to close a picker that does not have a selected value", () => {
      const wrapper = createWrapper({ data: generateMockPiping(1, 1, 1) });
      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", {
        id: "Section 1",
        displayName: "Section 1",
        pages: []
      });

      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("open")).toBe(true);
      wrapper.find(PAGE_PICKER_SELECTOR).simulate("titleClick");
      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("open")).toBe(true);
    });
  });

  describe("contentPicker data management", () => {
    it("should show correct question data for selected section", () => {
      const data = generateMockPiping(2, 1, 1);
      const wrapper = createWrapper({ data });

      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", data[1]);

      expect(wrapper.find(PAGE_PICKER_SELECTOR).prop("data")).toEqual(
        data[1].pages
      );
      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("data")).toEqual([]);
    });

    it("should show correct answer data for selected question", () => {
      const data = generateMockPiping(2, 2, 1);
      const wrapper = createWrapper({ data });

      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", data[1]);

      let pagePicker = wrapper.find(PAGE_PICKER_SELECTOR);
      pagePicker.simulate("optionClick", data[1].pages[1]);

      expect(wrapper.find(ANSWER_PICKER_SELECTOR).prop("data")).toEqual(
        data[1].pages[1].answers
      );
    });
  });
  describe("contentPicker Buttons", () => {
    it("should call onClose when cancel is clicked", () => {
      const wrapper = createWrapper({ data: [] });

      wrapper.find("[data-test='cancel-button']").simulate("click");
      expect(onClose).toHaveBeenCalled();
    });

    it("submit button should start disabled", () => {
      const wrapper = createWrapper({ data: [] });

      expect(wrapper.find("[data-test='submit-button']").prop("disabled")).toBe(
        true
      );
    });

    it("submit button should become enabled when an answer has been chosen", () => {
      const data = generateMockPiping(1, 1, 1);
      const wrapper = createWrapper({ data });

      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", data[0]);

      let pagePicker = wrapper.find(PAGE_PICKER_SELECTOR);
      pagePicker.simulate("optionClick", data[0].pages[0]);

      let answerPicker = wrapper.find(ANSWER_PICKER_SELECTOR);
      answerPicker.simulate("optionClick", data[0].pages[0].answers[0]);

      expect(wrapper.find("[data-test='submit-button']").prop("disabled")).toBe(
        false
      );
    });

    it("submit button should call onSubmit with the selected answer", () => {
      const data = generateMockPiping(1, 1, 1);
      const wrapper = createWrapper({ data });

      let sectionPicker = wrapper.find(SECTION_PICKER_SELECTOR);
      sectionPicker.simulate("titleClick");
      sectionPicker.simulate("optionClick", data[0]);

      let pagePicker = wrapper.find(PAGE_PICKER_SELECTOR);
      pagePicker.simulate("optionClick", data[0].pages[0]);

      let answerPicker = wrapper.find(ANSWER_PICKER_SELECTOR);
      answerPicker.simulate("optionClick", data[0].pages[0].answers[0]);

      wrapper.find("[data-test='submit-button']").simulate("click");
      expect(onSubmit).toHaveBeenCalledWith(data[0].pages[0].answers[0]);
    });
  });
});
