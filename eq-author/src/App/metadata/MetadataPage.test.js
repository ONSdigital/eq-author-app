import React from "react";
import { render, fireEvent, act } from "tests/utils/rtl";

import QuestionnaireContext from "components/QuestionnaireContext";
import { MeContext } from "App/MeContext";

import { UnwrappedMetadataPageContent } from "./MetadataPage";
import { publishStatusSubscription } from "components/EditorLayout/Header";

describe("Metadata page", () => {
  let props, questionnaireId, user, signOut, mocks;

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

    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: questionnaireId },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: questionnaireId,
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
    ];
  });

  const renderWithContext = (component, rest) =>
    render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QuestionnaireContext.Provider
          value={props.data && props.data.questionnaire}
        >
          {component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}`,
        urlParamMatcher: "/q/:questionnaireId",
        mocks,
        ...rest,
      }
    );

  it("should render loading state", () => {
    props = {
      ...props,
      loading: true,
      data: null,
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

  it("should render metadata content", async () => {
    const { getByTestId, getByText } = renderWithContext(
      <UnwrappedMetadataPageContent {...props} />
    );
    expect(getByTestId("metadata-table")).toBeTruthy();

    await act(async () => {
      await fireEvent.click(getByText("Add metadata"));
    });
    expect(props.onAddMetadata).toHaveBeenCalledWith(questionnaireId);
  });

  it("should render no metadata message when no metadata", async () => {
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
    expect(getByText("No metadata found")).toBeTruthy();

    await act(async () => {
      await fireEvent.click(getByText("Add metadata"));
    });
    expect(props.onAddMetadata).toHaveBeenCalledWith(questionnaireId);
  });
});
