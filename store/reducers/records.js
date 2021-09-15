import { Doctor, Organization } from "../../screens/app/records/common/types";
import {
  ADD_RECORD,
  REMOVE_RECORD,
  SELECT_ALL_RECORDS,
  SET_SELECT_MODE,
  CLEAR_ALL,
  SET_RECORDS,
  ENABLE_EDIT_SHARE_BUTTON,
  DISABLE_EDIT_SHARE_BUTTON,
} from "../actions/creators/actions";

const initState = {
  selectMode: false,
  editRecord: {
    initialRecords: {},
    mode: false,
    linkID: null,
    isFromAllLinksPage: false,
    enableShare: false,
  },
};
export default (state = initState, action) => {
  const { type, recordType, selectOnly, clearRecordType } = action;
  switch (type) {
    case ADD_RECORD:
      let newRecords = (!selectOnly && state[recordType]) || [];
      let newState = {
        ...state,
        [recordType]: [...newRecords, action.item],
      };
      if (clearRecordType) delete newState[clearRecordType];
      let enableShareButton = setShareButtonStatus(
        newState,
        state.editRecord.initialRecords
      );
      return {
        ...newState,
        editRecord: {
          ...state.editRecord,
          enableShare: enableShareButton,
        },
      };
    case REMOVE_RECORD:
      newRecords = [...state[recordType]];
      newRecords = newRecords.filter((i) => i.id !== action.item.id);
      newState = {
        ...state,
        [recordType]: newRecords,
      };
      enableShareButton = setShareButtonStatus(
        newState,
        state.editRecord.initialRecords
      );
      return {
        ...newState,
        editRecord: {
          ...state.editRecord,
          enableShare: enableShareButton,
        },
      };
    case SELECT_ALL_RECORDS:
      newState = {
        ...state,
        [recordType]: action.list,
      };
      enableShareButton = setShareButtonStatus(
        newState,
        state.editRecord.initialRecords
      );
      return {
        ...newState,
        editRecord: {
          ...state.editRecord,
          enableShare: enableShareButton,
        },
      };
    case SET_SELECT_MODE:
      return {
        ...state,
        selectMode: action.isSelectMode,
      };
    case SET_RECORDS:
      return {
        ...state,
        ...action.records,
        selectMode: true,
        editRecord: {
          initialRecords: { ...action.records },
          mode: true,
          linkID: action.id,
          isFromAllLinksPage: action.isFromAllLinksPage,
          enableShare: false,
        },
      };
    case ENABLE_EDIT_SHARE_BUTTON:
      return {
        ...state,
        editRecord: {
          ...state.editRecord,
          enableShare: true,
        },
      };
    case DISABLE_EDIT_SHARE_BUTTON:
      return {
        ...state,
        editRecord: {
          ...state.editRecord,
          enableShare: false,
        },
      };
    case CLEAR_ALL:
      return initState;
    default:
      return state;
  }
};

const setShareButtonStatus = (sharedRecords, initialRecords) => {
  if (
    Object.keys(sharedRecords).length - Object.keys(initialRecords).length !==
    2
  ) {
    return true;
  }
  for (const property in sharedRecords) {
    if (
      property !== "selectMode" &&
      property !== "editRecord" &&
      property !== Doctor &&
      property !== Organization
    ) {
      if (sharedRecords[property].length !== initialRecords[property].length) {
        return true;
      }
      if (
        sharedRecords[property].length &&
        !sharedRecords[property].every((r) =>
          initialRecords[property].find((i) => i.id == r.id)
        )
      ) {
        return true;
      }
    }
  }
  return false;
};
