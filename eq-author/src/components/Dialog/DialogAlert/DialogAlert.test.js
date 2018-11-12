import React from "react";
import { shallow } from "enzyme";
import {
  DialogAlertList,
  DialogAlert
} from "components/Dialog/DialogAlert/index";

describe("components/Modal/DialogAlert", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <DialogAlertList>
        <DialogAlert>This is an alert</DialogAlert>
        <DialogAlert>This is another alert</DialogAlert>
      </DialogAlertList>
    );
  });

  it("should render an alert", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
