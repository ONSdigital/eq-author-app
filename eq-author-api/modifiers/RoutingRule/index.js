module.exports = ({ repositories, modifiers }) => {
  return {
    create: require("./create")({ repositories, modifiers }),
    update: require("./update")({ repositories, modifiers }),
  };
};
