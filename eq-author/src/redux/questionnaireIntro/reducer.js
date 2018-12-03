import {
  INTRO_CREATE,
  DETAIL_ADD,
  DETAIL_REMOVE,
  INTRO_TOGGLE,
  DETAIL_MOVE_UP,
  DETAIL_MOVE_DOWN,
  DETAIL_UPDATE,
  FIELD_CHANGE
} from "./actions";

import { get, without, find, indexOf } from "lodash";

import move from "lodash-move";

const initialState = {};

const defaultBusinessState = metadata => {
  return {
    enabled: true,
    title: `<p>You are completing this for <span data-piped="metadata" data-id="${
      metadata.id
    }">${metadata.key}</span></p>`,
    description:
      "<p>If the company details or structure have changed contact us on 0300 1234 931 or email surveys@ons.gov.uk</p><ul><li>Data should relate to all sites in England, Scotland, Wales and Northern Ireland unless otherwise stated. </li><li>You can provide info estimates if actual figures aren’t available.</li><li>We will treat your data securely and confidentially.</li></ul>",
    legal: "notice-1",
    secondaryTitle: "Information you need",
    secondaryDescription:
      "You can select the dates of the period you are reporting for, if the given dates are not appropriate.",
    details: [],
    tertiaryTitle: "How we use your data",
    tertiaryDescription:
      '<ul><li>You cannot appeal your selection. Your business was selected to give us a comprehensive view of the UK economy.</li><li>The information you provide contributes to <a rel="noopener noreferrer" target="_blank" href="https://www.ons.gov.uk/economy/grossdomesticproductgdp">Gross Domestic Product (GDP).</a>.</li></ul>'
  };
};

const emptyIntro = {
  enabled: false,
  title: "",
  description: "",
  details: []
};

const updateState = (updater, state, payload) => {
  const updatedState = get(state, payload.id, emptyIntro);
  return {
    ...state,
    [payload.id]: updater(updatedState, payload)
  };
};

const createIntro = (state, payload) => ({
  ...state,
  ...defaultBusinessState(payload.metadata)
});

const toggleIntro = state => ({
  ...state,
  enabled: !get(state, "enabled", emptyIntro.enabled)
});

const addDetail = state => {
  return {
    ...state,
    details: [
      ...state.details,
      { title: "", description: "", id: Date.now().toString() }
    ]
  };
};

const updateDetail = (state, payload) => {
  const { name, value } = payload;
  const [_, field, id] = name.split("-");
  const details = [...state.details];

  return {
    ...state,
    details: details.map((detail, i) => {
      return detail.id === id
        ? {
            ...detail,
            [field]: value
          }
        : detail;
    })
  };
};

const removeDetail = (state, payload) => {
  return {
    ...state,
    details: without(
      state.details,
      find(state.details, { id: payload.detailId })
    )
  };
};

const moveDetailUp = (state, payload) => {
  const index = indexOf(
    state.details,
    find(state.details, { id: payload.detailId })
  );

  return {
    ...state,
    details: move(state.details, index, index - 1)
  };
};

const moveDetailDown = (state, payload) => {
  const index = indexOf(
    state.details,
    find(state.details, { id: payload.detailId })
  );

  return {
    ...state,
    details: move(state.details, index, index + 1)
  };
};

const changeField = (state, { name, value }) => {
  return {
    ...state,
    [name]: value
  };
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case INTRO_CREATE:
      return updateState(createIntro, state, payload);

    case INTRO_TOGGLE:
      return updateState(toggleIntro, state, payload);

    case DETAIL_ADD:
      return updateState(addDetail, state, payload);

    case DETAIL_REMOVE:
      return updateState(removeDetail, state, payload);

    case DETAIL_MOVE_UP:
      return updateState(moveDetailUp, state, payload);

    case DETAIL_MOVE_DOWN:
      return updateState(moveDetailDown, state, payload);

    case DETAIL_UPDATE:
      return updateState(updateDetail, state, payload);

    case FIELD_CHANGE:
      return updateState(changeField, state, payload);

    default:
      return state;
  }
};

export const getIntro = (state, questionnaireId) => ({
  ...emptyIntro,
  ...state[questionnaireId]
});
