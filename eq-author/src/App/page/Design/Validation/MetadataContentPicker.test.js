import React from "react";
import { shallow } from "enzyme";
import MetadataContentPicker from "./MetadataContentPicker";
import ContentPickerSelect from "components/ContentPickerSelectv3";
import { METADATA } from "components/ContentPickerSelectv3/content-types";

import { useQuestionnaire } from "components/QuestionnaireContext";
jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: () => ({
    questionnaire: {
      metadata: [
        {
          id: "91d8a289-e625-4b94-869b-a7d698be2294",
          key: "ru_name",
          alias: "Ru Name",
          type: "Text",
          textValue: "ESSENTIAL ENTERPRISE LTD.",
        },
        {
          id: "74c9ca55-dc3b-46da-b5eb-5eca48c4f443",
          key: "ref_p_start_date",
          alias: "Start Date",
          type: "Date",
          dateValue: "2016-05-01",
        },
      ],
    },
  }),
}));

const render = () => shallow(<MetadataContentPicker onSubmit={jest.fn()} />);

describe("MetadataContentPicker", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = render();
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should only display date type metadata", () => {
    const contentPicker = wrapper.find(ContentPickerSelect);
    const metadata = contentPicker.prop("data")[METADATA];
    expect(metadata[0].id).toEqual(
      useQuestionnaire().questionnaire.metadata[1].id
    );
  });
});
