import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import { Grid, Column } from "components/Grid";
import { colors } from "constants/theme";
import { times } from "lodash";

const StoryGridHelper = styled.div`
  background: ${colors.darkBlue};
  padding: 1.5em;
  color: white;
  font-size: 0.9em;
  font-family: monospace;
  height: 100%;
`;

const StoryGridSeperator = styled.div`
  margin-bottom: 1em;
`;

const StoryMargin = styled.div`
  margin: 1em;
`;

storiesOf("Grid", module)
  .addDecorator(story => <StoryMargin>{story()}</StoryMargin>)
  .add("Evenly distributed columns", () =>
    [12, 10, 8, 6, 4, 3, 2].map((col, i) => (
      <StoryGridSeperator key={i}>
        <Grid>
          {times(col, j => (
            <Column key={`${j}`}>
              <StoryGridHelper />
            </Column>
          ))}
        </Grid>
      </StoryGridSeperator>
    ))
  )
  .add("Unevenly distributed columns", () => (
    <StoryGridSeperator>
      <Grid>
        <Column cols={4}>
          <StoryGridHelper>4 Columns</StoryGridHelper>
        </Column>
        <Column>
          <StoryGridHelper>8 Columns</StoryGridHelper>
        </Column>
      </Grid>
    </StoryGridSeperator>
  ))
  .add("Align bottom", () => (
    <StoryGridSeperator>
      <Grid align="bottom">
        <Column cols={4}>
          <StoryGridHelper>
            Vestibulum id ligula porta felis euismod semper.
          </StoryGridHelper>
        </Column>
        <Column>
          <StoryGridHelper>
            <p>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula,
              eget lacinia odio sem nec elit. Maecenas sed diam eget risus
              varius blandit sit amet non magna. Maecenas sed diam eget risus
              varius blandit sit amet non magna. Aenean lacinia bibendum nulla
              sed consectetur. Etiam porta sem malesuada magna mollis euismod.
              Integer posuere erat a ante venenatis dapibus posuere velit
              aliquet.
            </p>
          </StoryGridHelper>
        </Column>
      </Grid>
    </StoryGridSeperator>
  ))
  .add("Align center", () => (
    <StoryGridSeperator>
      <Grid align="center">
        <Column cols={4}>
          <StoryGridHelper>
            Vestibulum id ligula porta felis euismod semper.
          </StoryGridHelper>
        </Column>
        <Column>
          <StoryGridHelper>
            <p>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula,
              eget lacinia odio sem nec elit. Maecenas sed diam eget risus
              varius blandit sit amet non magna. Maecenas sed diam eget risus
              varius blandit sit amet non magna. Aenean lacinia bibendum nulla
              sed consectetur. Etiam porta sem malesuada magna mollis euismod.
              Integer posuere erat a ante venenatis dapibus posuere velit
              aliquet.
            </p>
          </StoryGridHelper>
        </Column>
      </Grid>
    </StoryGridSeperator>
  ));
