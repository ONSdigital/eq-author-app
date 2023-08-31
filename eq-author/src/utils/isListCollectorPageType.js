import {
  ListCollectorQualifierPage,
  ListCollectorAddItemPage,
  ListCollectorConfirmationPage,
} from "constants/page-types";

const listCollectorPageTypes = [
  ListCollectorQualifierPage,
  ListCollectorAddItemPage,
  ListCollectorConfirmationPage,
];

const isListCollectorPageType = (pageType) => {
  return listCollectorPageTypes.some(
    (listCollectorPageType) => listCollectorPageType === pageType
  );
};

export default isListCollectorPageType;
