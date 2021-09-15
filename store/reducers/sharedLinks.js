import { SET_LINKS, REMOVE_LINK, UPDATE_EXPIRY_DATE } from "../actions/creators/actions";

const initState = {
  data: [],
};
export default (state = initState, action) => {
  const { type } = action;
  switch (type) {
    case SET_LINKS:
      return {
        ...state,
        data: action.data,
      };
    case REMOVE_LINK:
      newLinks = [...state.data];
      newLinks = newLinks.filter((i) => i.link_id !== action.id);
      return {
        ...state,
        data: newLinks,
      };
    case UPDATE_EXPIRY_DATE:
      newLinks = [...state.data];
      let item = newLinks.find((i) => i.link_id === action.id);
      item.expiresIn = action.expirationTime.expiresIn;
      item.expiry_date = action.expirationTime.expiry_date;
      item.share_forever = action.expirationTime.share_forever;
      return {
        ...state,
        data: newLinks,
      };
    default:
      return state;
  }
};
