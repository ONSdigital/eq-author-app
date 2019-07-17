import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import ModalWithNav from "./";

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
  let props;

  beforeEach(() => {
    props = {
      title: "I am a title",
      onClose: jest.fn(),
      startingTabId: "tab-1",
      isOpen: true,
      navItems: NAV_ITEMS,
    };
  });

  it("should not render anything when isOpen is false", () => {
    const { queryByText } = render(<ModalWithNav {...props} isOpen={false} />);
    expect(queryByText(props.navItems[0].title)).toBeFalsy();
  });

  it("should render a list of items", () => {
    const { getAllByText } = render(<ModalWithNav {...props} />);

    props.navItems.forEach(({ title }) => {
      expect(getAllByText(title)).toBeTruthy();
    });
  });

  it("should render the starting tab by default", () => {
    const { getByText } = render(<ModalWithNav {...props} />);
    expect(getByText(/Sed posuere/)).toBeTruthy();
  });

  it("should render the tab when the starting tab changes", () => {
    const { rerender, getByText } = render(
      <ModalWithNav {...props} startingTabId="tab-1" />
    );
    expect(getByText(/Sed posuere/)).toBeTruthy();

    rerender(<ModalWithNav {...props} startingTabId="tab-2" />);
    expect(getByText(/Praesent commodo/)).toBeTruthy();
  });

  it("should change the tab when the item is selected", () => {
    const { getByText } = render(
      <ModalWithNav {...props} startingTabId="tab-1" />
    );
    fireEvent.click(getByText("Euismod Ridiculus Parturient"));
    expect(getByText(/Praesent commodo/)).toBeTruthy();
  });

  it("should close when close is pressed in tabs", () => {
    const { getByLabelText } = render(<ModalWithNav {...props} />);
    fireEvent.click(getByLabelText("Close"));
    expect(props.onClose).toHaveBeenCalled();
  });
});
