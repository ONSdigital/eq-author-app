import React from "react";
import { render } from "tests/utils/rtl";

import { MeContext } from "App/MeContext";

import ConfirmationPagePreview from ".";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useMutation: jest.fn(() => [() => null]),
  useSubscription: jest.fn(() => jest.fn()),
}));

const me = {
  id: "me",
  name: "test",
};

const questionnaire = { id: "questionnaire-1" };

const renderConfirmationPagePreview = (props) => {
  return render(
    <MeContext.Provider value={{ me }}>
      <ConfirmationPagePreview {...props} />
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/page/${props.page.id}/preview`,
      urlParamMatcher: "/q/:questionnaireId/page/:pageId/preview",
    }
  );
};

describe("ConfirmationPagePreview", () => {
  let props;
  beforeEach(() => {
    const page = {
      id: "page-1",
      title: "Page 1",
      displayName: "Page 1",
      pageType: "ListCollectorConfirmationPage",
      answers: [
        {
          id: "answer-1",
          type: "Radio",
          options: [
            {
              id: "positive-option-1",
              label: "Positive option 1",
              description: "Positive description 1",
            },
            {
              id: "negative-option-1",
              label: "Negative option 1",
              description: "Negative description 1",
            },
          ],
        },
      ],
      folder: { id: "folder-1", listId: "list-1" },
      section: { id: "section-1" },
      comments: [],
      validationErrorInfo: { id: "validation-error-info", errors: [] },
    };

    props = { page };
  });

  it("should render confirmation preview page", () => {
    const { getByTestId } = renderConfirmationPagePreview(props);

    expect(
      getByTestId("list-collector-confirmation-page-preview")
    ).toBeInTheDocument();
  });

  it("should render options", () => {
    const { getByTestId, getByText } = renderConfirmationPagePreview(props);

    expect(
      getByTestId("preview-option-item-positive-option-1")
    ).toBeInTheDocument();
    expect(getByText(/Positive option 1/)).toBeInTheDocument();
    expect(getByText(/Positive description 1/)).toBeInTheDocument();

    expect(
      getByTestId("preview-option-item-negative-option-1")
    ).toBeInTheDocument();
    expect(getByText(/Negative option 1/)).toBeInTheDocument();
    expect(getByText(/Negative description 1/)).toBeInTheDocument();
  });

  it("should render error when option is missing label", () => {
    props.page.answers[0].options[0].label = "";
    const { queryByTestId, getByText } = renderConfirmationPagePreview(props);

    expect(
      queryByTestId("preview-option-item-positive-option-1")
    ).not.toBeInTheDocument();
    expect(
      queryByTestId("preview-option-error-positive-option-1")
    ).toBeInTheDocument();
    expect(getByText(/Missing label/)).toBeInTheDocument();

    expect(
      queryByTestId("preview-option-item-negative-option-1")
    ).toBeInTheDocument();
    expect(getByText(/Negative option 1/)).toBeInTheDocument();
    expect(getByText(/Negative description 1/)).toBeInTheDocument();
  });
});
