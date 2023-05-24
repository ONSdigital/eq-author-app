import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import PublishPage from "./PublishPage";

const mockUseSubscription = jest.fn();
const mockUseMutation = jest.fn();
const mockUseQuery = {
  loading: false,
  error: false,
  data: {
    publishHistory: [
      {
        id: "cb0bb329-6d54-4779-a9a7-e4a43055cd82",
        surveyId: "134",
        formType: "0005",
        publishDate: "2023-05-18T13:33:16.465Z",
        success: false,
      },
      {
        id: "459f73a5-5522-454f-8bda-dfa97ad65376",
        surveyId: "134",
        formType: "0005",
        publishDate: "2023-05-19T09:48:37.281Z",
        cirId: "c56afe93-63c6-47d6-8583-edb36596827b",
        version: "1",
        success: true,
      },
      {
        id: "45f8ac6c-1b7f-4e56-8adc-252bf624e4d6",
        surveyId: "134",
        formType: "0005",
        publishDate: "2023-05-22T11:01:19.654Z",
        cirId: "6c63549f-27bb-4ff8-aebe-d386e9046b80",
        version: "1",
        success: true,
      },
      {
        id: "5f4b236c-ef28-4db4-ba50-65c457e540a3",
        surveyId: "134",
        formType: "0005",
        publishDate: "2023-05-18T13:35:07.205Z",
        cirId: "d737af81-b596-430d-92b6-aad12ab4c630",
        version: "1",
        success: true,
      },
    ],
  },
};

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
  useSubscription: () => [mockUseSubscription],
  useQuery: () => [mockUseQuery],
}));

describe("Publish page", () => {
  const renderPublishPage = (props) => {
    return render(<PublishPage {...props} />);
  };

  it("should render publish page", () => {
    const { getByTestId } = renderPublishPage();

    expect(getByTestId("publish-page-container")).toBeInTheDocument();
  });

  it("should publish questionnaire on button click", () => {
    const { getByTestId } = renderPublishPage();

    const publishButton = getByTestId("btn-publish-schema");
    fireEvent.click(publishButton);

    expect(mockUseMutation).toHaveBeenCalledTimes(1);
  });
});
