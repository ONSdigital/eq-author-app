import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import SplitButton from "components/buttons/SplitButton";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";

const ref = React.createRef();

const renderSplitButton = ({
  primaryAction,
  primaryText,
  onToggleOpen,
  open,
  children,
}) =>
  render(
    <SplitButton
      onPrimaryAction={primaryAction}
      primaryText={primaryText}
      onToggleOpen={onToggleOpen}
      open={open}
      dataTest="splitbutton"
      ref={ref}
    >
      {children}
    </SplitButton>
  );

describe("SplitButton", () => {
  let props;

  beforeEach(() => {
    const children = (
      <ButtonGroup>
        <Button onClick={jest.fn()} secondary>
          Add other answer
        </Button>
      </ButtonGroup>
    );

    props = {
      primaryAction: jest.fn(),
      primaryText: "Add checkbox",
      onToggleOpen: jest.fn(),
      open: false,
      children,
    };
  });

  it("should render when closed", () => {
    const { getByTestId } = renderSplitButton(props);
    expect(getByTestId("splitbutton-menu")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("should call onToggleOpen when menu button clicked", () => {
    const { getByText } = renderSplitButton(props);
    fireEvent.click(getByText("Show additional options"));
    expect(props.onToggleOpen).toHaveBeenCalledWith(true);
  });
});
