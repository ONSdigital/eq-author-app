import React from "react";
import { shallow } from "enzyme";
import { UnconnectedModalWithNav } from "./";

const NAV_ITEMS = [
  {
    id: "tab-1",
    title: "Cursus Bibendum",
    render: () => (
      <div id="tab-1">
        <h2>Cursus Bibendum</h2>
        <p>
          Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros. Cras justo odio, dapibus ac
          facilisis in, egestas eget quam. Donec ullamcorper nulla non metus
          auctor fringilla.
        </p>
      </div>
    ),
  },
  {
    id: "tab-2",
    title: "Euismod Ridiculus Parturient",
    render: () => (
      <div id="tab-2">
        <h2>Euismod Ridiculus Parturient</h2>
        <p>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas sed
          diam eget risus varius blandit sit amet non magna. Aenean lacinia
          bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue
          laoreet rutrum faucibus dolor auctor. Donec id elit non mi porta
          gravida at eget metus.
        </p>
      </div>
    ),
  },
  {
    id: "tab-3",
    title: "Tellus Dolor",
    render: () => (
      <div id="tab-3">
        <h2>Tellus Dolor</h2>
        <p>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Fusce dapibus, tellus ac cursus commodo, tortor mauris
          condimentum nibh, ut fermentum massa justo sit amet risus. Vestibulum
          id ligula porta felis euismod semper. Aenean eu leo quam. Pellentesque
          ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis
          interdum.
        </p>
      </div>
    ),
  },
];

describe("ModalWithNav", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      id: "TEST_MODAL",
      title: "I am a title",
      onClose: jest.fn(),
      gotoTab: jest.fn(),
      navItems: NAV_ITEMS,
    };
  });

  it("should render a list of items", () => {
    wrapper = shallow(<UnconnectedModalWithNav {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an open Modals", () => {
    wrapper = shallow(<UnconnectedModalWithNav {...props} isOpen />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should close when close is pressed in tabs", () => {
    wrapper = shallow(<UnconnectedModalWithNav {...props} />);
    wrapper.find("Tabs").simulate("close");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("should call gotoTab with the id of the tab and the new id when changed", () => {
    wrapper = shallow(<UnconnectedModalWithNav {...props} />);
    wrapper.find("Tabs").simulate("change", 1);
    expect(props.gotoTab).toHaveBeenCalledWith(props.id, 1);
  });
});
