import React from "react";
import PropTypes from "prop-types";
import { render, fireEvent } from "tests/utils/rtl";
import { useHistory } from "react-router-dom";

import ScrollPane from ".";

const HistoryWrapper = ({ reset }) => {
  const history = useHistory();
  return (
    <ScrollPane scrollToTop={reset} data-test="scroll-pane">
      <button
        data-test={"history-push"}
        onClick={() => history.push("/hello")}
      />
    </ScrollPane>
  );
};

HistoryWrapper.propTypes = {
  reset: PropTypes.bool,
};

describe("ScrollPane", () => {
  it("should render", () => {
    expect(
      render(<ScrollPane>Children</ScrollPane>).asFragment()
    ).toMatchSnapshot();
  });

  it("should not reset scrollTop on change to history when scrollToTop isn't present", () => {
    const { getByTestId } = render(<HistoryWrapper />);

    expect(getByTestId("scroll-pane").scrollTop).toEqual(0);

    getByTestId("scroll-pane").scrollTop = 250;

    expect(getByTestId("scroll-pane").scrollTop).toEqual(250);

    fireEvent.click(getByTestId("history-push"));

    expect(getByTestId("scroll-pane").scrollTop).toEqual(250);
  });

  it("should reset scrollTop on change to history when scrollToTop is present", () => {
    const { getByTestId } = render(<HistoryWrapper reset />);

    expect(getByTestId("scroll-pane").scrollTop).toEqual(0);

    getByTestId("scroll-pane").scrollTop = 250;

    expect(getByTestId("scroll-pane").scrollTop).toEqual(250);

    fireEvent.click(getByTestId("history-push"));

    expect(getByTestId("scroll-pane").scrollTop).toEqual(0);
  });
});
