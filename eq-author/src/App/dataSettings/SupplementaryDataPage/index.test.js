import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { render, fireEvent, screen, waitFor, act } from "tests/utils/rtl";

import SupplementaryDataPage from ".";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import QuestionnaireContext from "components/QuestionnaireContext";
import unlinkSupplementaryDataMutation from "graphql/unlinkSupplementaryData.graphql";
import GET_SUPPLEMENTARY_DATA_SURVEY_ID_LIST from "graphql/getSupplementaryDataSurveyIdList.graphql";
import GET_SUPPLEMENTARY_DATA_VERSIONS_QUERY from "graphql/getSupplementaryDataVersions.graphql";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),

  useMutation: jest.fn(() => [() => null]),
}));

const renderSupplementaryDatasetPage = (questionnaire, props, user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn(), props }}>
      <QuestionnaireContext.Provider value={{ questionnaire }}>
        <SupplementaryDataPage {...props} />
      </QuestionnaireContext.Provider>
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/data/supplementary-data`,
      urlParamMatcher: "/q/:questionnaireId/data/supplementary-data",
      mocks,
    }
  );
};

describe("Supplementary dataset page", () => {
  let questionnaire, props, user, mocks;

  beforeEach(() => {
    questionnaire = {
      id: "1",
      isPublic: true,
    };
    props = {
      match: {
        params: {
          modifier: "",
          questionnaireId: questionnaire.id,
        },
      },
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
    useQuery.mockImplementation((key) => {
      if (key === GET_SUPPLEMENTARY_DATA_VERSIONS_QUERY) {
        return {
          loading: false,
          error: false,
          data: {
            supplementaryDataVersions: {
              surveyId: "121",
              versions: [
                {
                  guid: "123-111-789",
                  // eslint-disable-next-line camelcase
                  sds_schema_version: "1",
                  // eslint-disable-next-line camelcase
                  sds_published_at: "2023-01-12T13:37:27+00:00",
                },
                {
                  guid: "123-222-789",
                  // eslint-disable-next-line camelcase
                  sds_schema_version: "2",
                  // eslint-disable-next-line camelcase
                  sds_published_at: "2023-02-08T12:37:27+00:00",
                },
                {
                  guid: "123-333-789",
                  // eslint-disable-next-line camelcase
                  sds_schema_version: "3",
                  // eslint-disable-next-line camelcase
                  sds_published_at: "2023-03-23T08:37:27+00:00",
                },
              ],
            },
          },
        };
      } else if (key === GET_SUPPLEMENTARY_DATA_SURVEY_ID_LIST) {
        return {
          data: {
            supplementaryDataSurveyIdList: [
              { surveyId: "121", surveyName: "survey1" },
              { surveyId: "122", surveyName: "survey2" },
            ],
          },
        };
      } else {
        return {
          loading: false,
          error: false,
          data: {},
        };
      }
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  it("should display heading and basic text", () => {
    const { getByText } = renderSupplementaryDatasetPage(
      questionnaire,
      props,
      user,
      mocks
    );
    expect(
      getByText("Select a supplementary dataset schema to link to")
    ).toBeTruthy();
    expect(
      getByText("Only one dataset schema can be linked per questionnaire.")
    ).toBeTruthy();
  });

  describe("survey picker", () => {
    it("should display a select picker with all options", () => {
      const { getByText, getByTestId } = renderSupplementaryDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );
      expect(getByText("Select a survey ID")).toBeTruthy();
      expect(getByTestId("list-select")).toBeTruthy();
      expect(getByText(/121/)).toBeTruthy();
      expect(getByText(/122/)).toBeTruthy();
    });

    it("should select a survey id", async () => {
      const { getByText, getByTestId, getAllByTestId, findAllByText } =
        renderSupplementaryDatasetPage(questionnaire, props, user, mocks);

      const select = getByTestId("list-select");
      fireEvent.change(select, { target: { value: "121" } });
      await waitFor(() => {
        expect(getByText("Datasets schemas for survey ID 121")).toBeTruthy();
        expect(getByTestId("datasets-table")).toBeTruthy();
        expect(findAllByText("Date created")).toBeTruthy();
        expect(getAllByTestId("dataset-row")).toBeTruthy();
        expect(getByText("23/03/2023")).toBeTruthy();
      });
    });

    it("should link a dataset", async () => {
      const callMutation = jest.fn();
      useMutation.mockImplementation(jest.fn(() => [callMutation]));
      const { getByTestId, getAllByTestId } = renderSupplementaryDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );

      const select = getByTestId("list-select");
      fireEvent.change(select, { target: { value: "121" } });
      await act(async () => {
        await fireEvent.click(getAllByTestId("btn-link")[0]);
      });
      expect(callMutation).toBeCalledTimes(1);
    });
  });

  describe("linked data", () => {
    it("should show linked data table", () => {
      useQuery.mockImplementation(() => ({
        loading: false,
        error: false,
        data: {
          supplementaryData: {
            id: "121-222-789",
            surveyId: "068",
            version: "2",
            dateCreated: "2023-01-12T13:37:27+00:00",
            data: [
              {
                id: "123-456-789",
                listName: "",
                schemaFields: [
                  {
                    identifier: "company_name",
                    type: "string",
                    id: "84b92922-308d-40bb-bd6d-6c0f06e37c75",
                    example: "Joe Bloggs PLC",
                  },
                  {
                    type: "string",
                    identifier: "company_type",
                    id: "5a92b57f-5e16-4bc2-a159-01bf63a5af13",
                    example: "Public Limited Company",
                  },
                ],
              },
            ],
          },
        },
      }));

      const { getByText } = renderSupplementaryDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );
      expect(getByText("Dataset for survey ID 068")).toBeTruthy();
      expect(getByText("ID:")).toBeTruthy();
      expect(getByText("Version:")).toBeTruthy();
      expect(getByText("Date created:")).toBeTruthy();
      expect(getByText("Data fields available for piping")).toBeTruthy();
      expect(getByText("Public Limited Company")).toBeTruthy();
    });
  });

  describe("Unlink dataset", () => {
    it("should display the Unlink dataset modal", async () => {
      useQuery.mockImplementation(() => ({
        loading: false,
        error: false,
        data: {
          supplementaryData: {
            id: "121-222-789",
            surveyId: "068",
            version: "2",
            dateCreated: "2023-01-12T13:37:27+00:00",
            data: [
              {
                id: "123-456-789",
                listName: "",
                schemaFields: [
                  {
                    identifier: "company_name",
                    type: "string",
                    id: "84b92922-308d-40bb-bd6d-6c0f06e37c75",
                    example: "Joe Bloggs PLC",
                  },
                  {
                    type: "string",
                    identifier: "company_type",
                    id: "5a92b57f-5e16-4bc2-a159-01bf63a5af13",
                    example: "Public Limited Company",
                  },
                ],
              },
            ],
          },
        },
      }));
      mocks = [
        ...mocks,
        {
          request: {
            query: unlinkSupplementaryDataMutation,
            variables: {},
          },
          result: () => {
            return {
              data: {
                unlinkSupplementaryData: {
                  id: "1",
                  supplementaryData: null,
                  __typename: "Questionnaire",
                },
              },
            };
          },
        },
      ];
      const { getByTestId, queryByTestId } = renderSupplementaryDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );
      fireEvent.click(getByTestId("btn-unlink-dataset"));
      expect(getByTestId("modal")).toBeInTheDocument();
      await waitFor(() => screen.getByTestId("btn-modal-positive"));

      await act(async () => {
        await fireEvent.click(getByTestId("btn-modal-positive"));
      });
      expect(queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should close the Unlink dataset modal", async () => {
      useQuery.mockImplementationOnce(() => ({
        loading: false,
        error: false,
        data: {
          supplementaryData: {
            id: "121-222-789",
            surveyId: "068",
            version: "2",
            dateCreated: "2023-01-12T13:37:27+00:00",
            data: [
              {
                id: "123-456-789",
                listName: "",
                schemaFields: [
                  {
                    identifier: "company_name",
                    type: "string",
                    id: "84b92922-308d-40bb-bd6d-6c0f06e37c75",
                    example: "Joe Bloggs PLC",
                  },
                  {
                    type: "string",
                    identifier: "company_type",
                    id: "5a92b57f-5e16-4bc2-a159-01bf63a5af13",
                    example: "Public Limited Company",
                  },
                ],
              },
            ],
          },
        },
      }));
      const { getByTestId, queryByTestId } = renderSupplementaryDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );
      fireEvent.click(getByTestId("btn-unlink-dataset"));
      expect(getByTestId("modal")).toBeInTheDocument();
      await act(async () => {
        await fireEvent.click(getByTestId("btn-modal-negative"));
      });
      expect(queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  describe("Loading page", () => {
    it("should render the loading page", async () => {
      useQuery.mockImplementation(() => ({
        loading: true,
        error: false,
        data: null,
      }));
      const { getByTestId, queryByText } = renderSupplementaryDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );
      expect(getByTestId("loading")).toBeInTheDocument();
      expect(queryByText("Select a survey ID")).toBeNull();
    });
  });

  describe("Error page", () => {
    it("should render the error page", async () => {
      useQuery.mockImplementation(() => ({
        loading: false,
        error: true,
        data: null,
      }));
      const { getByTestId, queryByText } = renderSupplementaryDatasetPage(
        questionnaire,
        props,
        user,
        mocks
      );
      expect(getByTestId("error")).toBeInTheDocument();
      expect(queryByText("Select a survey ID")).toBeNull();
    });
  });
});
