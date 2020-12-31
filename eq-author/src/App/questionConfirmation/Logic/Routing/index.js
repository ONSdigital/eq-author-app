import React from "react";
import Logic from "App/shared/Logic";
import NoRouting, {
  Title,
  Paragraph,
} from "App/shared/Logic/Routing/NoRouting";

export default () => (
  <Logic>
    <NoRouting disabled>
      <Title> Routing logic not available for confirmation questions </Title>
      <Paragraph>
        {" "}
        The route will be based on the answer to the previous question.{" "}
      </Paragraph>
    </NoRouting>
  </Logic>
);
