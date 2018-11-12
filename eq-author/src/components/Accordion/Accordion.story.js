import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import { Accordion, AccordionPanel } from "components/Accordion";

const CenterXY = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 20em;
`;

class AccordionWrapper extends React.Component {
  render() {
    return (
      <Accordion>
        <AccordionPanel title="Section properties" open>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi
            eaque modi aspernatur quod aut deleniti voluptate dolorem velit?
            Repellendus esse est temporibus blanditiis deserunt repellat quas
            iure, ipsum maxime rerum.
          </p>
        </AccordionPanel>
        <AccordionPanel title="Page properties">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum
            dolorum unde, quisquam eum doloribus blanditiis error dolore nisi
            aspernatur sed beatae adipisci? Ullam, consequatur nemo saepe
            voluptates minus, sunt dolore.
          </p>
        </AccordionPanel>
        <AccordionPanel title="Answer properties">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum
            dolorum unde, quisquam eum doloribus blanditiis error dolore nisi
            aspernatur sed beatae adipisci? Ullam, consequatur nemo saepe
            voluptates minus, sunt dolore.
          </p>
        </AccordionPanel>
      </Accordion>
    );
  }
}

const CenterDecorator = storyFn => <CenterXY>{storyFn()}</CenterXY>;

storiesOf("Accordion", module)
  .addDecorator(CenterDecorator)
  .add("Default", () => <AccordionWrapper />);
