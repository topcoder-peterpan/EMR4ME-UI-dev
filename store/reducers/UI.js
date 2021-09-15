import {
  START_LOADING,
  END_LOADING,
  DISABLE_RTL,
  ENABLE_RTL,
  SHOW_ALERT,
  HIDE_ALERT,
  HIDE_CUSTOM_LOADER,
  SHOW_CUSTOM_LOADER,
  BLOCK_PAGE,
  OPEN_WEB_VIEW,
  SHOW_CONFIRM_DIALOGUE,
  HIDE_CONFIRM_DIALOGUE,
  SHOW_HELP_DIALOGUE,
  HIDE_HELP_DIALOGUE,
} from "../actions/creators/actions";

const initState = {
  isLoading: false,
  isRTL: false,
  msg: "",
  note: "",
  title: "",
  type: "info",
  present: false,
  alertVisible: false,
  iconName: "info",
  showCustomLoader: true,
  block: false,
  webViewOpened: false,
  showConfirmationDialogue: false,
  leftButton: null,
  rightButton: null,
  showHelpDialogue: false,
};
export default (state = initState, action) => {
  const { type } = action;
  switch (type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case OPEN_WEB_VIEW:
      return {
        ...state,
        webViewOpened: action.payload,
      };
    case BLOCK_PAGE:
      return {
        ...state,
        block: true,
      };

    case END_LOADING:
      return {
        ...state,
        isLoading: false,
        block: false,
      };
    case SHOW_CUSTOM_LOADER:
      return {
        ...state,
        showCustomLoader: true,
      };
    case HIDE_CUSTOM_LOADER:
      return {
        ...state,
        showCustomLoader: false,
      };
    case ENABLE_RTL:
      return { ...state, isRTL: true };
    case DISABLE_RTL:
      return { ...state, isRTL: false };
    case SHOW_ALERT:
      return {
        ...state,
        ...action.payload,
        alertVisible: true,
      };
    case HIDE_ALERT:
      return {
        ...state,
        msg: "",
        note: "",
        title: "",
        type: "info",
        present: false,
        alertVisible: false,
        iconName: "info",
      };
    case SHOW_CONFIRM_DIALOGUE:
      return {
        ...state,
        ...action.payload,
        showConfirmationDialogue: true,
      };
    case HIDE_CONFIRM_DIALOGUE:
      return {
        ...state,
        msg: "",
        note: "",
        title: "",
        showConfirmationDialogue: false,
        leftButton: null,
        rightButton: null,
      };
    case SHOW_HELP_DIALOGUE:
      return {
        ...state,
        ...action.payload,
        showHelpDialogue: true,
      };
    case HIDE_HELP_DIALOGUE:
      return {
        ...state,
        msg: "",
        note: "",
        title: "",
        showHelpDialogue: false,
        leftButton: null,
      };
    default:
      return state;
  }
};
