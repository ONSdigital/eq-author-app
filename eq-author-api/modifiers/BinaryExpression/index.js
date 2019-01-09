module.exports = ({ repositories, modifiers }) => {
  return {
    create: require("./create")({ repositories, modifiers }),
    update: require("./update")({ repositories, modifiers }),
    onAnswerCreated: require("./onAnswerCreated")({ repositories, modifiers }),
    onAnswerDeleted: require("./onAnswerDeleted")({ repositories })
  };
};
