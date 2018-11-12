import React from "react";
import { shallow } from "enzyme";
import SplitButton from "components/SplitButton";
import MenuButton from "components/SplitButton/MenuButton";
import Popout from "components/Popout";
import Button from "components/Button";
import ButtonGroup from "components/ButtonGroup";

const createWrapper = (
  { primaryAction, primaryText, onToggleOpen, open, children },
  render = shallow
) =>
  render(
    <SplitButton
      onPrimaryAction={primaryAction}
      primaryText={primaryText}
      onToggleOpen={onToggleOpen}
      open={open}
      dataTest="splitbutton"
    >
      {children}
    </SplitButton>
  );

describe("SplitButton", () => {
  let wrapper;
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
      children
    };
    wrapper = createWrapper(props);
  });

  it("should render when closed", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render when open", () => {
    wrapper = createWrapper(Object.assign({}, props, { open: true }));
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onToggleOpen when menu button clicked", () => {
    wrapper
      .find(Popout)
      .dive()
      .find(MenuButton)
      .simulate("click");
    expect(props.onToggleOpen).toHaveBeenCalledWith(true);
  });
});
