import React from "react";
import { shallow } from "enzyme";
import { render as rtlRender, fireEvent } from "tests/utils/rtl";
import ContentPickerSelect from "components/ContentPickerSelect";
import ContentPicker from "components/ContentPickerv2";

import {
  ANSWER,
  DESTINATION,
  METADATA,
  QUESTION,
} from "components/ContentPickerSelect/content-types";
import { CURRENCY, NUMBER } from "constants/answer-types";
import { DATE, LANGUAGE, REGION, TEXT } from "constants/metadata-types";

const render = (props, render = shallow) => {
  return render(<ContentPickerSelect {...props} />);
};

describe("ContentPickerSelect", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      match: {
        params: {
          questionnaireId: "1",
        },
      },
      data: {
        questionnaire: {
          id: "1",
          metadata: [],
          sections: [],
        },
      },
      onSubmit: jest.fn(),
      answerTypes: [NUMBER, CURRENCY],
      selectedContentDisplayName: "foobar",
      name: "contentPicker",
      loading: false,
      contentTypes: [ANSWER],
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should disable select button correctly", () => {
    wrapper = render({ ...props, loading: true });
    expect(wrapper).toMatchSnapshot();

    wrapper = render({ ...props, error: { foo: "bar" } });
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly handle picker submit", () => {
    const selectedItem = { id: 1, displayName: "New selected answer" };
    wrapper.find(ContentPicker).simulate("submit", selectedItem);

    expect(props.onSubmit).toHaveBeenCalledWith({
      name: props.name,
      value: selectedItem,
    });
  });

  it("should correctly handle picker open", () => {
    const { getByTestId, queryByTestId } = rtlRender(
      <ContentPickerSelect {...props} />
    );
    expect(queryByTestId("no-previous-answers")).toBeFalsy();
    const openButton = getByTestId("content-picker-select");
    fireEvent.click(openButton);
    getByTestId("no-previous-answers");
  });

  describe("metadata types", () => {
    let data;
    data = {
      questionnaire: {
        id: "1",
        metadata: [
          {
            id: "1",
            type: DATE,
          },
          {
            id: "2",
            type: TEXT,
          },
          {
            id: "3",
            type: LANGUAGE,
          },
          {
            id: "4",
            type: REGION,
          },
        ],
        sections: [],
      },
    };
    beforeEach(() => {});

    it("should correctly filter by type", () => {
      wrapper = render({
        ...props,
        metadataTypes: [DATE],
        contentTypes: [METADATA],
        data,
      });

      const metadataData = wrapper.find(ContentPicker).props("metadataData");
      expect(metadataData).toMatchSnapshot();
    });

    it("should correctly show all types when none specified", () => {
      wrapper = render({
        ...props,
        contentTypes: [METADATA],
        data,
      });

      const metadataData = wrapper.find(ContentPicker).props("metadataData");
      expect(metadataData).toMatchSnapshot();
    });

    it("should correctly filter empty metadata", () => {
      wrapper = render({
        ...props,
        metadataTypes: [DATE],
        contentTypes: [METADATA],
      });

      const metadataData = wrapper.find(ContentPicker).props("metadataData");
      expect(metadataData).toMatchSnapshot();
    });
  });

  describe("content types", () => {
    it("should render answer and metadata", () => {
      wrapper = render({ ...props, contentTypes: [ANSWER, METADATA] });
      expect(wrapper).toMatchSnapshot();
    });

    it("should render answer ", () => {
      wrapper = render({ ...props, contentTypes: [ANSWER] });
      expect(wrapper).toMatchSnapshot();
    });

    it("should render metadata", () => {
      wrapper = render({ ...props, contentTypes: [METADATA] });
      expect(wrapper).toMatchSnapshot();
    });

    it("should render question", () => {
      wrapper = render({ ...props, contentTypes: [QUESTION] });
      expect(wrapper).toMatchSnapshot();
    });

    it("should render destination", () => {
      wrapper = render({ ...props, contentTypes: [DESTINATION] });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
