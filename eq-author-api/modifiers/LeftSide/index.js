module.exports = ({ repositories, modifiers }) => {
  return {
    update: require("./update")({ repositories, modifiers })
  };
};
