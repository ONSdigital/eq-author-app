import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { ANSWER, METADATA } from "../ContentPickerSelectv3/content-types";
import Theme from "contexts/themeContext";

import MetadataPicker from "./MetadataPicker";

describe("Metadata Picker", () => {
  let props;
  const setContentType = jest.fn();

  beforeEach(() => {
    props = {
      data: [
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
      contentType: ANSWER,
      contentTypes: [ANSWER, METADATA],
      setContentType,
      isSelected: jest.fn(),
      onSelected: jest.fn(),
      isSectionSelected: jest.fn(),
    };
  });
  const renderMetadataPicker = () =>
    render(
      <Theme>
        <MetadataPicker {...props} />
      </Theme>
    );

  it("should render the metadata radio button", () => {
    const { getByText } = renderMetadataPicker();
    expect(getByText("Metadata")).toBeTruthy();
  });

  it("should click the Metadata radio button", () => {
    const { getByTestId } = renderMetadataPicker();
    const metadataRadio = getByTestId("content-type-selector-Metadata");
    fireEvent.click(metadataRadio);
    expect(setContentType).toHaveBeenCalledWith(METADATA);
  });

  it("should display the metadata list", () => {
    const { getByText, getByTestId } = renderMetadataPicker();
    const metadataRadio = getByTestId("content-type-selector-Metadata");
    fireEvent.click(metadataRadio);
    expect(setContentType).toHaveBeenCalledWith(METADATA);
    expect(getByText("ru_name")).toBeTruthy();
    expect(getByText("ref_p_start_date")).toBeTruthy();
  });
});
