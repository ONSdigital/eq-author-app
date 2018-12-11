const { omit } = require("lodash/fp");

const TYPE_TRANSLATION = {
  customValue: "Custom",
  selectedOptions: "SelectedOptions",
  answerId: "Answer",
  metadataId: "Metadata"
};

module.exports = ({ repositories }) => async ({
  id,
  left,
  condition,
  right
}) => {
  const expression = await repositories.BinaryExpression2.getById(id);
  if (left) {
    const leftSide = await repositories.LeftSide2.getByExpressionId(
      expression.id
    );

    const inputKey = Object.keys(left)[0];

    await repositories.LeftSide2.update({
      id: leftSide.id,
      ...left,
      type: TYPE_TRANSLATION[inputKey]
    });
  }

  if (condition) {
    await repositories.BinaryExpression2.update({
      id: expression.id,
      condition: condition
    });
  }

  if (right) {
    let existingRightSide = await repositories.RightSide2.getByExpressionId(
      expression.id
    );

    const inputKey = Object.keys(right)[0];

    // selectedOptions not passed to right side repo as it is an array
    const newRightProperties = omit("selectedOptions", {
      type: TYPE_TRANSLATION[inputKey],
      [inputKey]: right[inputKey]
    });

    let updatedRightSide;
    if (existingRightSide) {
      updatedRightSide = await repositories.RightSide2.update({
        ...newRightProperties,
        id: existingRightSide.id
      });
    } else {
      updatedRightSide = await repositories.RightSide2.insert({
        ...newRightProperties,
        expressionId: expression.id
      });
    }

    if (updatedRightSide.type === "SelectedOptions") {
      await repositories.SelectedOptions2.deleteBySideId(updatedRightSide.id);
      await Promise.all(
        right.selectedOptions.map(optionId =>
          repositories.SelectedOptions2.insert({
            sideId: updatedRightSide.id,
            optionId
          })
        )
      );
    }
  }

  return repositories.BinaryExpression2.getById(expression.id);
};
