import React from "react";
import { render } from "tests/utils/rtl";
import { Grid, Column } from "./";

describe("components/Grid", () => {
  it("should render a basic two column grid", () => {
    const { getByText } = render(
      <Grid>
        <Column>Column 1</Column>
        <Column>Column 2</Column>
      </Grid>
    );
    expect(getByText("Column 1")).toBeTruthy();
    expect(getByText("Column 2")).toBeTruthy();
  });

  it("should be optionally aligned center", () => {
    const { getByTestId } = render(
      <Grid align={"center"}>
        <Column>Column 1</Column>
        <Column>Column 2</Column>
      </Grid>
    );
    expect(getByTestId("grid")).toHaveStyleRule("align-items", "center");
  });

  it("should be optionally aligned bottom", () => {
    const { getByTestId } = render(
      <Grid align={"bottom"}>
        <Column>Column 1</Column>
        <Column>Column 2</Column>
      </Grid>
    );
    expect(getByTestId("grid")).toHaveStyleRule("align-items", "flex-end");
  });

  it("should not fill height of container, if specified", () => {
    const { getByTestId } = render(
      <Grid fillHeight={false}>
        <Column>Column 1</Column>
        <Column>Column 2</Column>
      </Grid>
    );
    expect(getByTestId("grid")).toHaveStyleRule("flex", "0 1 auto");
  });

  describe("Columns", () => {
    it("should render an asymmetrical two column grid ", () => {
      const { asFragment } = render(
        <Grid>
          <Column>Column 1</Column>
          <Column cols={4}>Column 2</Column>
        </Grid>
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("should render a gutterless grid", () => {
      const { getByTestId } = render(
        <Grid>
          <Column gutters={false}>Column 1</Column>
        </Grid>
      );
      expect(getByTestId("column")).toHaveStyleRule("padding", "0");
    });

    it("should render a column with an offset", () => {
      const { getByTestId } = render(
        <Grid>
          <Column cols={2} offset={2}>
            Column 1
          </Column>
        </Grid>
      );
      expect(getByTestId("column")).toHaveStyleRule(
        "margin-left",
        "16.666666666666664%"
      );
    });
  });
});
