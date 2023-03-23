import React from "react";
import { render } from "tests/utils/rtl";

import PublishPage from "./PublishPage";

describe("Publish page", () => {
  const renderPublishPage = (props) => {
    return render(<PublishPage {...props} />);
  };

  it("should render publish page", () => {
    const { getByTestId } = renderPublishPage();

    expect(getByTestId("publish-page-container")).toBeInTheDocument();
  });
});
