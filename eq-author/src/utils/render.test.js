import React from "react";
import render from "utils/render";

describe("render", () => {
  let target, props;

  const DummyComponent = ({ text }) => <h1>{text}</h1>; // eslint-disable-line

  beforeEach(() => {
    target = document.createElement("div");
    props = { text: "hello world" };
  });

  it("renders into given element", () => {
    render(target, {}, DummyComponent);
    expect(target.querySelector("h1")).toBeDefined();
  });

  it("renders with supplied props", () => {
    render(target, props, DummyComponent);
    expect(target.textContent).toEqual(props.text);
  });
});
