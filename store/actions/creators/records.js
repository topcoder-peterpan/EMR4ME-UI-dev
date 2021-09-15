import {
  ADD_RECORD,
  REMOVE_RECORD,
  SELECT_ALL_RECORDS,
  SET_SELECT_MODE,
  CLEAR_ALL,
  SET_RECORDS,
  ENABLE_EDIT_SHARE_BUTTON,
  DISABLE_EDIT_SHARE_BUTTON,
} from "./actions";

export const addRecord = (item, recordType, selectOnly, clearRecordType) => ({
  type: ADD_RECORD,
  item,
  recordType,
  selectOnly,
  clearRecordType,
});

export const removeRecord = (item, recordType) => ({
  type: REMOVE_RECORD,
  item,
  recordType,
});

export const selectAllRecords = (list, recordType) => ({
  type: SELECT_ALL_RECORDS,
  list,
  recordType,
});

export const setSelectMode = (isSelectMode) => ({
  type: SET_SELECT_MODE,
  isSelectMode,
});

export const setRecords = (id, records, isFromAllLinksPage) => ({
  type: SET_RECORDS,
  id,
  records,
  isFromAllLinksPage
});

export const EnableShareButton = () => ({
  type: ENABLE_EDIT_SHARE_BUTTON,
});

export const DisableShareButton = () => ({
  type: DISABLE_EDIT_SHARE_BUTTON,
});

export const clearAllRecords = () => ({
  type: CLEAR_ALL,
});
