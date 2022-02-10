import React from "react";
import { shallow } from "enzyme";

import HelpModal from "./HelpModal";

const render = (props) => shallow(<HelpModal {...props} />);

describe("HelpModal", () => {
  let props, onClose, wrapper;

  beforeEach(() => {
    onClose = jest.fn();
    props = {
      isOpen: false,
      onClose: onClose,
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
