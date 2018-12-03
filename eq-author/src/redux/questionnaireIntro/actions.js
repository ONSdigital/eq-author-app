export const INTRO_CREATE = "INTRO_CREATE";
export const INTRO_TOGGLE = "INTRO_TOGGLE";

export const DETAIL_ADD = "DETAIL_ADD";
export const DETAIL_REMOVE = "DETAIL_REMOVE";
export const DETAIL_UPDATE = "DETAIL_UPDATE";
export const DETAIL_MOVE_UP = "DETAIL_MOVE_UP";
export const DETAIL_MOVE_DOWN = "DETAIL_MOVE_DOWN";

export const FIELD_CHANGE = "FIELD_CHANGE";

export const createIntro = (id, metadata) => ({
  type: INTRO_CREATE,
  payload: { id, metadata }
});

export const toggleIntro = id => ({
  type: INTRO_TOGGLE,
  payload: {
    id
  }
});

export const addDetail = id => ({
  type: DETAIL_ADD,
  payload: {
    id
  }
});

export const removeDetail = (id, detailId) => ({
  type: DETAIL_REMOVE,
  payload: {
    id,
    detailId
  }
});

export const moveDetailUp = (id, detailId) => ({
  type: DETAIL_MOVE_UP,
  payload: {
    id,
    detailId
  }
});

export const moveDetailDown = (id, detailId) => ({
  type: DETAIL_MOVE_DOWN,
  payload: {
    id,
    detailId
  }
});

export const changeField = (id, name, value) => {
  return {
    type: FIELD_CHANGE,
    payload: {
      id,
      name,
      value
    }
  };
};

export const updateDetail = (id, name, value) => {
  return {
    type: DETAIL_UPDATE,
    payload: {
      id,
      name,
      value
    }
  };
};
