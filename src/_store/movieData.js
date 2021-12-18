import { MOVIE_All_DATA } from "../_constants";
const initialState = "";

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case MOVIE_All_DATA:
      return {
        ...state,
        data: payload,
      };

    default:
      return state;
  }
};

export default reducer;
