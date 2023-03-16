import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { render, fireEvent } from "tests/utils/rtl";

import ONSDatasetPage from ".";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import QuestionnaireContext from "components/QuestionnaireContext";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
}));

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: {
    prepopSchemaVersions: {
      surveyId: "123",
      versions: [
        {
          id: "123-111-789",
          version: "1",
          dateCreated: "2023-01-12T13:37:27+00:00",
        },
        {
          id: "123-222-789",
          version: "2",
          dateCreated: "2023-02-08T12:37:27+00:00",
        },
        {
          id: "123-333-789",
          version: "3",
          dateCreated: "2023-03-23T08:37:27+00:00",
        },
      ],
    },
  },
}));

const renderONSDatasetPage = (questionnaire, props, user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn(), props }}>
      <QuestionnaireContext.Provider value={{ questionnaire }}>
        <ONSDatasetPage {...props} />
      </QuestionnaireContext.Provider>
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/data/ons-dataset`,
      urlParamMatcher: "/q/:questionnaireId/data/ons-dataset",
      mocks,
    }
  );
};

describe("ONS dataset page", () => {
  let questionnaire, props, user, mocks;

  beforeEach(() => {
    questionnaire = {
      id: "1",
      isPublic: true,
    };
    props = {
      match: { params: { modifier: "", questionnaireId: questionnaire.id } },
    };
    user = {
      id: "2",
      displayName: "TestName",
      email: "TEAmail@mail.com",
      picture: "",
      admin: true,
      name: "T",
      __typename: "User",
    };
    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: questionnaire.id },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: questionnaire.id,
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
    ];
  });

  it("should display heading and basic text", () => {
    const { getByText } = renderONSDatasetPage(
      questionnaire,
      props,
      user,
      mocks
    );
    expect(getByText("Select an ONS dataset to link to")).toBeTruthy();
    expect(
      getByText("Only one dataset can be linked per questionnaire.")
    ).toBeTruthy();
  });
  describe("survey picker", () => {
    it("should a select picker with all options", () => {
      const { getByText, getByTestId } = renderONSDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );
      expect(getByText("Select a survey ID")).toBeTruthy();
      expect(getByTestId("list-select")).toBeTruthy();
      expect(getByText(/123/)).toBeTruthy();
    });

    it("should select a survey id", async () => {
      const { getByText, getByTestId, getAllByTestId } = renderONSDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );

      const select = getByTestId("list-select");
      fireEvent.change(select, { target: { value: "123" } });

      expect(getByText("Datasets for survey ID 123")).toBeTruthy();
      expect(getByTestId("datasets-table")).toBeTruthy();
      expect(getByText("Date created")).toBeTruthy();
      expect(getAllByTestId("dataset-row")).toBeTruthy();
      expect(getByText("2023/03/23")).toBeTruthy();
    });
  });
});
