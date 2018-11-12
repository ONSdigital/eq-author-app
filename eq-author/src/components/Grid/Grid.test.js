import React from "react";
import { mount } from "enzyme";
import { Grid, Column } from "components/Grid";

let wrapper;

describe("components/Grid", () => {
  it("should render a basic two column grid", () => {
    wrapper = mount(
      <Grid>
        <Column>Column 1</Column>
        <Column>Column 2</Column>
      </Grid>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should be optionally aligned center", () => {
    wrapper = mount(
      <Grid align={"center"}>
        <Column>Column 1</Column>
        <Column>Column 2</Column>
      </Grid>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should be optionally aligned bottom", () => {
    wrapper = mount(
      <Grid align={"bottom"}>
        <Column>Column 1</Column>
        <Column>Column 2</Column>
      </Grid>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should not fill height of container, if specified", () => {
    wrapper = mount(
      <Grid fillHeight={false}>
        <Column>Column 1</Column>
        <Column>Column 2</Column>
      </Grid>
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe("Columns", () => {
    it("should render an asymmetrical two column grid ", () => {
      wrapper = mount(
        <Grid>
          <Column>Column 1</Column>
          <Column cols={4}>Column 2</Column>
        </Grid>
      );
      expect(wrapper).toMatchSnapshot();
    });

    it("should render a gutterless grid", () => {
      wrapper = mount(
        <Grid>
          <Column gutters={false}>Column 1</Column>
          <Column gutters={false}>Column 2</Column>
        </Grid>
      );
      expect(wrapper).toMatchSnapshot();
    });

    it("should render a column with an offset", () => {
      wrapper = mount(
        <Grid>
          <Column cols={2} offset={2}>
            Column 1
          </Column>
          <Column cols={8}>Column 2</Column>
        </Grid>
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
