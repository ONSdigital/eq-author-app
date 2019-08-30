import React from "react";
import { render } from "tests/utils/rtl";

import QuestionnaireContext from "components/QuestionnaireContext";
import { MeContext } from "App/MeContext";

import { UnwrappedMetadataPageContent } from "./MetadataPage";

describe("Metadata page", () => {
  let props, questionnaireId, user, signOut;

  beforeEach(() => {
    questionnaireId = "1";

    props = {
      onAddMetadata: jest.fn(),
      onDeleteMetadata: jest.fn(),
      onUpdateMetadata: jest.fn(),
      loading: false,
      data: {
        questionnaire: {
          id: questionnaireId,
          metadata: [
            {
              id: "2",
            },
          ],
        },
      },
    };

    user = {
      id: "123",
      displayName: "Rick Sanchez",
      email: "wubbalubba@dubdub.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };

    signOut = jest.fn();
  });

  const renderWithContext = (component, ...rest) =>
    render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QuestionnaireContext.Provider value={props.data.questionnaire}>
          {component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      ...rest
    );

  it("should render loading state", () => {
    props = {
      ...props,
      loading: true,
    };

    const { getByTestId } = renderWithContext(
      <UnwrappedMetadataPageContent {...props} />
    );
    expect(getByTestId("loading")).toBeTruthy();
  });

  it("should render error state", () => {
    props = {
      ...props,
      error: {},
    };

    const { getByText } = renderWithContext(
      <UnwrappedMetadataPageContent {...props} />
    );
    expect(getByText("Oops! Something went wrong")).toBeTruthy();
  });

  it("should render questionnaire error state", () => {
    props = {
      ...props,
      data: {
        questionnaire: null,
      },
    };

    const { getByText } = renderWithContext(
      <UnwrappedMetadataPageContent {...props} />
    );
    expect(getByText("Oops! Questionnaire could not be found")).toBeTruthy();
  });

  it("should render metadata content", () => {
    const { getByTestId, getByText } = renderWithContext(
      <UnwrappedMetadataPageContent {...props} />
    );
    expect(getByTestId("metadata-table")).toBeTruthy();

    getByText("Add metadata").click();
    expect(props.onAddMetadata).toHaveBeenCalledWith(questionnaireId);
  });

  it("should render no metadata message when no metadata", () => {
    props = {
      ...props,
      data: {
        questionnaire: {
          id: questionnaireId,
          metadata: [],
        },
      },
    };

    const { getByText } = renderWithContext(
      <UnwrappedMetadataPageContent {...props} />
    );
    expect(getByText("You don't have any metadata yet.")).toBeTruthy();

    getByText("Add metadata").click();
    expect(props.onAddMetadata).toHaveBeenCalledWith(questionnaireId);
  });
});
