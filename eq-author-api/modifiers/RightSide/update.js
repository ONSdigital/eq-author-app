const answerTypes = require("../../constants/answerTypes");

const isLeftSideAnswerTypeCompatible = (leftSideType, rightSideType) => {
  const AnswerTypesToRightTypes = {
    [answerTypes.CURRENCY]: "Custom",
    [answerTypes.NUMBER]: "Custom",
    [answerTypes.PERCENTAGE]: "Custom",
    [answerTypes.RADIO]: "SelectedOptions",
  };

  return AnswerTypesToRightTypes[leftSideType] === rightSideType;
};

module.exports = ({ repositories }) => async ({
  expressionId,
  customValue,
  selectedOptions,
}) => {
  let type, newRightProperties;
  if (customValue) {
    type = "Custom";
    newRightProperties = {
      type,
      customValue,
    };
  } else {
    type = "SelectedOptions";
    newRightProperties = {
      type,
    };
  }

  const leftSide = await repositories.LeftSide2.getByExpressionId(expressionId);
  if (!leftSide) {
    throw new Error("Cannot have a right side without a left");
  }
  const leftSideAnswer = await repositories.Answer.getById(leftSide.answerId);

  if (!isLeftSideAnswerTypeCompatible(leftSideAnswer.type, type)) {
    throw new Error("Left side is incompatible with Right side.");
  }

  let existingRightSide = await repositories.RightSide2.getByExpressionId(
    expressionId
  );

  let updatedRightSide;
  if (existingRightSide) {
    updatedRightSide = await repositories.RightSide2.update({
      ...newRightProperties,
      id: existingRightSide.id,
    });
  } else {
    updatedRightSide = await repositories.RightSide2.insert({
      ...newRightProperties,
      expressionId: expressionId,
    });
  }

  if (updatedRightSide.type === "SelectedOptions") {
    await repositories.SelectedOptions2.deleteBySideId(updatedRightSide.id);
    await Promise.all(
      selectedOptions.map(optionId =>
        repositories.SelectedOptions2.insert({
          sideId: updatedRightSide.id,
          optionId,
        })
      )
    );
  }
  const binaryExpression = await repositories.BinaryExpression2.getById(
    expressionId
  );

  return binaryExpression;
};
