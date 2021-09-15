import { loaderTimeOut } from "../../../config";
import store from "./../../configStore";
import {
  OPEN_WEB_VIEW,
  BLOCK_PAGE,
  START_LOADING,
  END_LOADING,
  ENABLE_RTL,
  DISABLE_RTL,
  SHOW_ALERT,
  HIDE_ALERT,
  HIDE_CUSTOM_LOADER,
  SHOW_CUSTOM_LOADER,
  SHOW_CONFIRM_DIALOGUE,
  HIDE_CONFIRM_DIALOGUE,
  SHOW_HELP_DIALOGUE,
  HIDE_HELP_DIALOGUE, 
} from "./actions";

let timeout = null;
export const startLoading = () => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    store.dispatch(endLoading());
  }, loaderTimeOut);
  return {
    type: START_LOADING,
  };
};

export const endLoading = () => ({
  type: END_LOADING,
});

export const hideCustomLoader = () => ({
  type: HIDE_CUSTOM_LOADER,
});

export const showCustomLoader = () => ({
  type: SHOW_CUSTOM_LOADER,
});

export const enableRTL = () => ({
  type: ENABLE_RTL,
});

export const disableRTL = () => ({
  type: DISABLE_RTL,
});

export const showAlert = (payload) => ({
  type: SHOW_ALERT,
  payload,
});

export const blockPage = () => ({
  type: BLOCK_PAGE,
});

export const setWebViewOpen = (payload) => ({
  type: OPEN_WEB_VIEW,
  payload,
});

export const hideAlert = () => ({
  type: HIDE_ALERT,
});

export const showConfirmDialogue = (payload) => ({
  type: SHOW_CONFIRM_DIALOGUE,
  payload,
});
export const hideConfirmDialogue = () => ({
  type: HIDE_CONFIRM_DIALOGUE,
});

export const showHelpPopup = (payload) => ({
  type: SHOW_HELP_DIALOGUE,
  payload,
});
export const hideHelpPopup = () => ({
  type: HIDE_HELP_DIALOGUE,
});
