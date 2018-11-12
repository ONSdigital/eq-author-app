import React from "react";
import { MemoryRouter } from "react-router";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import { colors } from "constants/theme";
import ModalFullScreen from "components/ModalFullScreen";
import Header from "components/Header";
import DialogHeader from "components/Dialog/DialogHeader";
import { Message, Heading } from "components/Dialog/DialogMessage";
import Button from "components/Button";

const CenteredHeading = styled(Heading)`
  padding: 2em;
  text-align: center;
  color: ${colors.textLight};
`;

const MainContainer = styled.div`
  padding: 2em 3em;
  min-height: 30em;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1 1 auto;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const handleOnClose = action("Close");

storiesOf("ModalFullScreen", module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
  ))
  .add("With scrollable content", () => (
    <div>
      <Header />
      <ModalFullScreen onClose={handleOnClose} isOpen>
        <DialogHeader>
          <Message>
            <CenteredHeading>Ridiculus Tellus Sit</CenteredHeading>
          </Message>
        </DialogHeader>
        <MainContainer>
          <Content>
            <p>
              Lorem ipsum dolor sit amet, magna pede, ac ac id condimentum,
              adipiscing lacinia arcu porttitor, tortor condimentum, ultrices
              odio orci ipsum sodales. Viverra odio maecenas volutpat sapien
              sed, semper erat pulvinar quis vitae fringilla consequatur. Ac
              pharetra lacus lectus wisi scelerisque, quisque gravida etiam
              lorem felis aenean condimentum, neque mauris. Aliquam a vel justo
              phasellus, vivamus posuere suspendisse nunc, placerat dui ipsum,
              molestie vitae hymenaeos pulvinar integer id tellus, convallis
              pellentesque qui luctus ut. Est pellentesque sit porta duis donec,
              amet orci a sociosqu primis, ac vehicula nec tortor, vitae ipsum a
              habitasse. Ut ipsum non at. Metus nec donec sed, in leo. Ante
              tellus per amet diam egestas, cum non nibh eu, justo libero mi
              libero scelerisque malesuada, quis sed nisi, massa a sagittis
              orci. Cursus dui in a elementum, lectus massa mauris proin.
              Curabitur habitant laoreet purus aenean aenean, nonummy blandit
              mauris habitant, donec elit. Rutrum quis nulla aliquam, a egestas
              ut, amet congue enim cubilia est sed. A sit voluptatem litora
              eget. Nullam lorem lorem. Vel in lacus sed hac nec, sodales
              natoque, lectus pharetra, quis dis mi purus fusce et commodo. Elit
              morbi urna luctus euismod integer vulputate. Id elementum vitae
              nisl, volutpat elit tellus consectetuer, varius tincidunt vivamus
              tortor, urna ipsum lacus bibendum molestie, tempor non sed felis
              rutrum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, magna pede, ac ac id condimentum,
              adipiscing lacinia arcu porttitor, tortor condimentum, ultrices
              odio orci ipsum sodales. Viverra odio maecenas volutpat sapien
              sed, semper erat pulvinar quis vitae fringilla consequatur. Ac
              pharetra lacus lectus wisi scelerisque, quisque gravida etiam
              lorem felis aenean condimentum, neque mauris. Aliquam a vel justo
              phasellus, vivamus posuere suspendisse nunc, placerat dui ipsum,
              molestie vitae hymenaeos pulvinar integer id tellus, convallis
              pellentesque qui luctus ut. Est pellentesque sit porta duis donec,
              amet orci a sociosqu primis, ac vehicula nec tortor, vitae ipsum a
              habitasse. Ut ipsum non at. Metus nec donec sed, in leo. Ante
              tellus per amet diam egestas, cum non nibh eu, justo libero mi
              libero scelerisque malesuada, quis sed nisi, massa a sagittis
              orci. Cursus dui in a elementum, lectus massa mauris proin.
              Curabitur habitant laoreet purus aenean aenean, nonummy blandit
              mauris habitant, donec elit. Rutrum quis nulla aliquam, a egestas
              ut, amet congue enim cubilia est sed. A sit voluptatem litora
              eget. Nullam lorem lorem. Vel in lacus sed hac nec, sodales
              natoque, lectus pharetra, quis dis mi purus fusce et commodo. Elit
              morbi urna luctus euismod integer vulputate. Id elementum vitae
              nisl, volutpat elit tellus consectetuer, varius tincidunt vivamus
              tortor, urna ipsum lacus bibendum molestie, tempor non sed felis
              rutrum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, magna pede, ac ac id condimentum,
              adipiscing lacinia arcu porttitor, tortor condimentum, ultrices
              odio orci ipsum sodales. Viverra odio maecenas volutpat sapien
              sed, semper erat pulvinar quis vitae fringilla consequatur. Ac
              pharetra lacus lectus wisi scelerisque, quisque gravida etiam
              lorem felis aenean condimentum, neque mauris. Aliquam a vel justo
              phasellus, vivamus posuere suspendisse nunc, placerat dui ipsum,
              molestie vitae hymenaeos pulvinar integer id tellus, convallis
              pellentesque qui luctus ut. Est pellentesque sit porta duis donec,
              amet orci a sociosqu primis, ac vehicula nec tortor, vitae ipsum a
              habitasse. Ut ipsum non at. Metus nec donec sed, in leo. Ante
              tellus per amet diam egestas, cum non nibh eu, justo libero mi
              libero scelerisque malesuada, quis sed nisi, massa a sagittis
              orci. Cursus dui in a elementum, lectus massa mauris proin.
              Curabitur habitant laoreet purus aenean aenean, nonummy blandit
              mauris habitant, donec elit. Rutrum quis nulla aliquam, a egestas
              ut, amet congue enim cubilia est sed. A sit voluptatem litora
              eget. Nullam lorem lorem. Vel in lacus sed hac nec, sodales
              natoque, lectus pharetra, quis dis mi purus fusce et commodo. Elit
              morbi urna luctus euismod integer vulputate. Id elementum vitae
              nisl, volutpat elit tellus consectetuer, varius tincidunt vivamus
              tortor, urna ipsum lacus bibendum molestie, tempor non sed felis
              rutrum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, magna pede, ac ac id condimentum,
              adipiscing lacinia arcu porttitor, tortor condimentum, ultrices
              odio orci ipsum sodales. Viverra odio maecenas volutpat sapien
              sed, semper erat pulvinar quis vitae fringilla consequatur. Ac
              pharetra lacus lectus wisi scelerisque, quisque gravida etiam
              lorem felis aenean condimentum, neque mauris. Aliquam a vel justo
              phasellus, vivamus posuere suspendisse nunc, placerat dui ipsum,
              molestie vitae hymenaeos pulvinar integer id tellus, convallis
              pellentesque qui luctus ut. Est pellentesque sit porta duis donec,
              amet orci a sociosqu primis, ac vehicula nec tortor, vitae ipsum a
              habitasse. Ut ipsum non at. Metus nec donec sed, in leo. Ante
              tellus per amet diam egestas, cum non nibh eu, justo libero mi
              libero scelerisque malesuada, quis sed nisi, massa a sagittis
              orci. Cursus dui in a elementum, lectus massa mauris proin.
              Curabitur habitant laoreet purus aenean aenean, nonummy blandit
              mauris habitant, donec elit. Rutrum quis nulla aliquam, a egestas
              ut, amet congue enim cubilia est sed. A sit voluptatem litora
              eget. Nullam lorem lorem. Vel in lacus sed hac nec, sodales
              natoque, lectus pharetra, quis dis mi purus fusce et commodo. Elit
              morbi urna luctus euismod integer vulputate. Id elementum vitae
              nisl, volutpat elit tellus consectetuer, varius tincidunt vivamus
              tortor, urna ipsum lacus bibendum molestie, tempor non sed felis
              rutrum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, magna pede, ac ac id condimentum,
              adipiscing lacinia arcu porttitor, tortor condimentum, ultrices
              odio orci ipsum sodales. Viverra odio maecenas volutpat sapien
              sed, semper erat pulvinar quis vitae fringilla consequatur. Ac
              pharetra lacus lectus wisi scelerisque, quisque gravida etiam
              lorem felis aenean condimentum, neque mauris. Aliquam a vel justo
              phasellus, vivamus posuere suspendisse nunc, placerat dui ipsum,
              molestie vitae hymenaeos pulvinar integer id tellus, convallis
              pellentesque qui luctus ut. Est pellentesque sit porta duis donec,
              amet orci a sociosqu primis, ac vehicula nec tortor, vitae ipsum a
              habitasse. Ut ipsum non at. Metus nec donec sed, in leo. Ante
              tellus per amet diam egestas, cum non nibh eu, justo libero mi
              libero scelerisque malesuada, quis sed nisi, massa a sagittis
              orci. Cursus dui in a elementum, lectus massa mauris proin.
              Curabitur habitant laoreet purus aenean aenean, nonummy blandit
              mauris habitant, donec elit. Rutrum quis nulla aliquam, a egestas
              ut, amet congue enim cubilia est sed. A sit voluptatem litora
              eget. Nullam lorem lorem. Vel in lacus sed hac nec, sodales
              natoque, lectus pharetra, quis dis mi purus fusce et commodo. Elit
              morbi urna luctus euismod integer vulputate. Id elementum vitae
              nisl, volutpat elit tellus consectetuer, varius tincidunt vivamus
              tortor, urna ipsum lacus bibendum molestie, tempor non sed felis
              rutrum.
            </p>
          </Content>
          <Buttons>
            <Button
              onClick={handleOnClose}
              variant="primary"
              data-test="btn-done"
            >
              Done
            </Button>
          </Buttons>
        </MainContainer>
      </ModalFullScreen>
    </div>
  ));
