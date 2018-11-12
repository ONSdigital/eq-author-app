module.exports = type => {
  switch (type) {
    case "Currency":
      return { required: false, decimals: 0 };
    case "Number":
      return { required: false, decimals: 0 };
    case "Date":
      return { required: false, format: "dd/mm/yyyy" };
    default:
      return { required: false };
  }
};
