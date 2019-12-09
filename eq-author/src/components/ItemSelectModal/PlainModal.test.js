import React from "react";
import PlainModal from "components/ItemSelectModal/PlainModal";
import { render } from "tests/utils/rtl";

describe("PositionModal/PlainModal", () => {
  it("should render", () => {
    const { asFragment } = render(
      <PlainModal isOpen onClose={jest.fn()}>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis
          dignissimos, ipsum laboriosam autem ipsa corrupti dicta tempore
          provident magnam saepe consectetur molestiae illo ad temporibus, quasi
          animi rem aliquid omnis.
        </p>
      </PlainModal>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
