import React from "react";
import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import { shallow } from "enzyme";
import { times } from "lodash";

import {
  CalculatedSummaryPage,
  ListCollectorQualifierPage,
  ListCollectorAddItemPage,
  ListCollectorConfirmationPage,
} from "constants/page-types";

describe("PositionModal/ItemSelect", () => {
  const createWrapper = (props = {}, render = shallow) =>
    render(
      <ItemSelect {...props} name="foo">
        {times(5, (i) => (
          <Option value={String(i)} key={i}>
            {i}
          </Option>
        ))}
      </ItemSelect>
    );

  it("should render", () => {
    const onChange = jest.fn();
    const value = "0";

    const wrapper = createWrapper({ value, onChange });
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it("should call onChange prop on change", () => {
    const onChange = jest.fn();
    const value = "0";

    const wrapper = createWrapper({ value, onChange });

    wrapper
      .dive()
      .find(Option)
      .last()
      .simulate("change", { target: { value: "4" } });

    expect(onChange).toHaveBeenCalledWith({ name: "foo", value: "4" });
  });

  describe("Option", () => {
    const createOption = (props = {}) =>
      shallow(
        <Option
          selected
          id="test"
          value="foo"
          name="bar"
          onChange={jest.fn()}
          {...props}
        >
          bar
        </Option>
      );

    const createListFolderOptions = (props) =>
      shallow(
        <ItemSelect name="foo" value="0">
          <Option
            selected
            id="list-qualifier-page"
            value="list-qualifier-page"
            name="list-qualifier-page"
            onChange={jest.fn()}
            pageType={ListCollectorQualifierPage}
            index={0}
            selectedItemPosition={2}
            data-test="option-list-qualifier-page"
            {...props}
          >
            Qualifier page
          </Option>
          <Option
            selected
            id="list-add-item-page"
            value="list-add-item-page"
            name="list-add-item-page"
            onChange={jest.fn()}
            pageType={ListCollectorAddItemPage}
            index={1}
            selectedItemPosition={2}
            data-test="option-list-add-item-page"
            {...props}
          >
            Add item page
          </Option>
          <Option
            selected
            id="question-page"
            value="question-page"
            name="question-page"
            onChange={jest.fn()}
            pageType="QuestionPage"
            index={2}
            selectedItemPosition={2}
            data-test="option-question-page"
            {...props}
          >
            Add item page
          </Option>
          <Option
            selected
            id="list-confirmation-page"
            value="list-confirmation-page"
            name="list-confirmation-page"
            onChange={jest.fn()}
            pageType={ListCollectorConfirmationPage}
            index={3}
            selectedItemPosition={2}
            data-test="option-list-confirmation-page"
            {...props}
          >
            Confirmation page
          </Option>
        </ItemSelect>
      );

    it("should render", () => {
      expect(createOption()).toMatchSnapshot();
    });

    it("should invoke on change handler", () => {
      const onChange = jest.fn();

      const wrapper = createOption({ onChange, id: "change-test" });
      wrapper.find("#change-test").simulate("change");

      expect(onChange).toHaveBeenCalled();
    });

    it("should disable option if page is list qualifier", () => {
      const wrapper = createOption({ pageType: ListCollectorQualifierPage });

      const label = wrapper.find("[data-test='option-label-foo']");
      expect(label.prop("disabled")).toBe(true);
    });

    it("should disable option if page is list confirmation", () => {
      const wrapper = createOption({
        pageType: ListCollectorConfirmationPage,
      });

      const label = wrapper.find("[data-test='option-label-foo']");
      expect(label.prop("disabled")).toBe(true);
    });

    it("should disable option if page is add item and option appears before selected option", () => {
      const wrapper = createListFolderOptions();
      const addItemOption = wrapper.find(
        "[data-test='option-list-add-item-page']"
      );

      const addItemLabel = addItemOption
        .dive()
        .find("[data-test='option-label-list-add-item-page']");

      expect(addItemLabel.prop("disabled")).toBe(true);
    });

    it("should disable option if option is repeating section and entity being moved is list folder", () => {
      const wrapper = createOption({
        repeatingSection: true,
        entityToMove: { id: "folder-1", listId: "list-1" },
      });

      const label = wrapper.find("[data-test='option-label-foo']");
      expect(label.prop("disabled")).toBe(true);
    });

    it("should not disable option if page is question page", () => {
      const wrapper = createOption({
        pageType: "QuestionPage",
      });

      const label = wrapper.find("[data-test='option-label-foo']");
      expect(label.prop("disabled")).toBe(false);
    });

    describe("Confirmation and calculated summary", () => {
      it("should disable option if page is list type and selected page has a confirmation page", () => {
        const wrapper = createListFolderOptions({
          selectedItem: {
            id: "page-1",
            confirmation: { id: "confirmation-1" },
          },
        });

        const qualifierOption = wrapper.find(
          "[data-test='option-list-qualifier-page']"
        );
        const addItemOption = wrapper.find(
          "[data-test='option-list-add-item-page']"
        );
        const confirmationOption = wrapper.find(
          "[data-test='option-list-confirmation-page']"
        );

        const qualifierLabel = qualifierOption
          .dive()
          .find("[data-test='option-label-list-qualifier-page']");
        const addItemLabel = addItemOption
          .dive()
          .find("[data-test='option-label-list-add-item-page']");
        const confirmationLabel = confirmationOption
          .dive()
          .find("[data-test='option-label-list-confirmation-page']");

        expect(qualifierLabel.prop("disabled")).toBe(true);
        expect(addItemLabel.prop("disabled")).toBe(true);
        expect(confirmationLabel.prop("disabled")).toBe(true);
      });

      it("should disable option if page is list type and selected page is calculated summary", () => {
        const wrapper = createListFolderOptions({
          selectedItem: {
            id: "page-1",
            pageType: CalculatedSummaryPage,
          },
        });

        const qualifierOption = wrapper.find(
          "[data-test='option-list-qualifier-page']"
        );
        const addItemOption = wrapper.find(
          "[data-test='option-list-add-item-page']"
        );
        const confirmationOption = wrapper.find(
          "[data-test='option-list-confirmation-page']"
        );

        const qualifierLabel = qualifierOption
          .dive()
          .find("[data-test='option-label-list-qualifier-page']");
        const addItemLabel = addItemOption
          .dive()
          .find("[data-test='option-label-list-add-item-page']");
        const confirmationLabel = confirmationOption
          .dive()
          .find("[data-test='option-label-list-confirmation-page']");

        expect(qualifierLabel.prop("disabled")).toBe(true);
        expect(addItemLabel.prop("disabled")).toBe(true);
        expect(confirmationLabel.prop("disabled")).toBe(true);
      });
    });
  });
});
