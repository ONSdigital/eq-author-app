const options = { month: "2-digit", day: "2-digit", year: "numeric" };

const FormattedDate = ({ date }) => {
  return new Date(date).toLocaleDateString("en-GB", options);
};

export default FormattedDate;
