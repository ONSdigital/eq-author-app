import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import {
  ANSWER,
  METADATA,
  SUPPLEMENTARY_DATA,
} from "../ContentPickerSelectv3/content-types";
import Theme from "contexts/themeContext";

import SupplementaryDataPicker from "./SupplementaryDataPicker";

describe("Supplementary Data Picker", () => {
  let props;
  const setContentType = jest.fn();

  beforeEach(() => {
    props = {
      data: [
        {
          surveyId: "221",
          data: [
            {
              schemaFields: [
                {
                  identifier: "employer_paye",
                  description:
                    "The tax office employer reference. This will be between 1 and 10 characters, which can be letters and numbers.",
                  type: "string",
                  example: "AB456",
                  selector: "reference",
                  id: "c5f64732-3bb2-40ba-8b0d-fc3b7e22c834",
                },
              ],
              id: "f0d7091a-44be-4c88-9d78-a807aa7509ec",
              listName: "",
            },
            {
              schemaFields: [
                {
                  identifier: "local-units",
                  description: "Name of the local unit",
                  type: "string",
                  example: "STUBBS BUILDING PRODUCTS LTD",
                  selector: "name",
                  id: "673a30af-5197-4d2a-be0c-e5795a998491",
                },
                {
                  identifier: "local-units",
                  description: "The “trading as” name for the local unit",
                  type: "string",
                  example: "STUBBS PRODUCTS",
                  selector: "trading_name",
                  id: "af2ff1a6-fc5d-419f-9538-0d052a5e6728",
                },
              ],
              id: "6e901afa-473a-4704-8bbd-de054569379c",
              listName: "local-units",
            },
          ],
          sdsDateCreated: "2023-12-15T11:21:34Z",
          sdsGuid: "621c954b-5523-4eda-a3eb-f18bebd20b8d",
          sdsVersion: "1",
          id: "b6c84aee-ea11-41e6-8be8-5715b066d297",
        },
      ],
      contentType: ANSWER,
      contentTypes: [ANSWER, METADATA, SUPPLEMENTARY_DATA],
      setContentType,
      isSelected: jest.fn(),
      onSelected: jest.fn(),
      isSectionSelected: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderSupplementaryDataPicker = () =>
    render(
      <Theme>
        <SupplementaryDataPicker {...props} />
      </Theme>
    );

  it("should render the 'Answer from supplementary data' radio button", () => {
    const { getByText } = renderSupplementaryDataPicker();
    expect(getByText("Answer from supplementary data")).toBeTruthy();
  });

  it("should click the 'Answer from supplementary data' radio button", () => {
    const { getByTestId } = renderSupplementaryDataPicker();
    const supplementaryDataRadio = getByTestId(
      "content-type-selector-supplementaryData"
    );
    fireEvent.click(supplementaryDataRadio);
    expect(setContentType).toHaveBeenCalledWith(SUPPLEMENTARY_DATA);
  });
});
