import React from "react";
import { shallow } from "enzyme";
import { UnconnectedSavingIndicator } from "./";

jest.useFakeTimers();

describe("SavingIndicator", () => {
  let currentTime;

  beforeEach(() => {
    currentTime = 0;
  });

  const advanceByTime = (amount) => {
    currentTime += amount;
    jest.runTimersToTime(currentTime);
  };

  const findIndicator = (wrapper) =>
    wrapper.find(`[data-test="saving-indicator"]`);

  it("should render when starting saving", () => {
    const wrapper = shallow(
      <UnconnectedSavingIndicator isSaving={false} hasError={false} />
    );
    wrapper.setProps({ isSaving: true });

    expect(findIndicator(wrapper).exists()).toBe(true);
  });

  it("should show spinner for at least one second", () => {
    const wrapper = shallow(
      <UnconnectedSavingIndicator isSaving={false} hasError={false} />
    );

    wrapper.setProps({ isSaving: true });
    advanceByTime(250);
    expect(findIndicator(wrapper).exists()).toBe(true);

    wrapper.setProps({ isSaving: false });
    expect(findIndicator(wrapper).exists()).toBe(true);

    advanceByTime(1000);
    wrapper.update();
    expect(findIndicator(wrapper).exists()).toBe(false);
  });

  it("should hide immediately if saving for more than one second", () => {
    const wrapper = shallow(
      <UnconnectedSavingIndicator isSaving={false} hasError={false} />
    );

    wrapper.setProps({ isSaving: true });
    expect(findIndicator(wrapper).exists()).toBe(true);

    advanceByTime(1500);
    wrapper.update();
    expect(findIndicator(wrapper).exists()).toBe(true);

    wrapper.setProps({ isSaving: false });
    expect(findIndicator(wrapper).exists()).toBe(false);
  });

  it("should not show if there is an error", () => {
    const wrapper = shallow(
      <UnconnectedSavingIndicator isSaving={false} hasError />
    );

    wrapper.setProps({ isSaving: true });
    expect(findIndicator(wrapper).exists()).toBe(false);
  });

  it("should not show if user doesn't have permission", () => {
    const wrapper = shallow(
      <UnconnectedSavingIndicator
        isSaving={false}
        hasError={false}
        isUnauthorized
      />
    );

    wrapper.setProps({ isSaving: true });
    expect(findIndicator(wrapper).exists()).toBe(false);
  });
});
