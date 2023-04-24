import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import PublishPage from "./PublishPage";

const mockUseSubscription = jest.fn();
const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
  useSubscription: () => [mockUseSubscription],
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
