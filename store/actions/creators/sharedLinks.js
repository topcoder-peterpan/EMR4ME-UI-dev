import {
  SET_LINKS,
  REMOVE_LINK,
  UPDATE_EXPIRY_DATE,
} from "./actions";

import {
  insertLink,
  modifyLink,
  getLink,
  getLinks,
  revokeLink,
  updateExpiryDate,
} from "../../../apis/share";
import { showAlert } from "./UI";
import { i18n } from "../../../util";

export const addLink = (data) => (dispatch) =>
  insertLink(data)
    .then((data) => {
      if (data.statusCode == 0) {
        dispatch(
          showAlert({
            msg: i18n.t("records.content.shareSuccess"),
            type: "success",
            present: false,
            iconName: "check",
          })
        );
      }
    })
    .catch((err) => {});

export const updateLink = (data) => (dispatch) =>
  modifyLink(data)
    .then((responseData) => {
      if (responseData.statusCode == 0) {
        const item = data.payload;
        dispatch(modifyExpiryDate(item.link_id, { expiresIn: item.expiresIn, expiry_date: item.expiry_date, share_forever: item.share_forever }));
        dispatch(
          showAlert({
            msg: i18n.t("records.content.shareUpdateSuccess"),
            type: "success",
            present: false,
            iconName: "check",
          })
        );
      }
    })
    .catch((err) => {});
    
export const getLinkByID = (data) => getLink(data);
export const getAllLinks = (data) => getLinks(data);

export const deleteLink = (data) => (dispatch) =>
  revokeLink(data)
    .then((data) => {
      if (data.statusCode == 0) {
        dispatch(removeLinkFromStore(data.payload.link_id));
        dispatch(
          showAlert({
            msg: i18n.t("records.shareRecords.deleteSuccess"),
            type: "success",
            present: false,
            iconName: "check",
          })
        );
      }
    })
    .catch((err) => {
      dispatch(
        showAlert({
          msg: i18n.t("records.shareRecords.deleteFail"),
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    });

export const updateLinkExpiryDate = (data) => (dispatch) =>
  updateExpiryDate(data)
    .then((data) => {
      if (data.statusCode == 0) {
        const item = data.payload;
        dispatch(modifyExpiryDate(item.link_id, { expiresIn: item.expiresIn, expiry_date: item.expiry_date, share_forever: item.share_forever }));
        dispatch(
          showAlert({
            msg: i18n.t("records.shareRecords.updateSuccess"),
            type: "success",
            present: false,
            iconName: "check",
          })
        );
      }
    })
    .catch((err) => {
      dispatch(
        showAlert({
          msg: i18n.t("records.shareRecords.updateFail"),
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    });

export const setLinks = (data) => ({
  type: SET_LINKS,
  data,
});

const removeLinkFromStore = (id) => ({
  type: REMOVE_LINK,
  id,
});

export const modifyExpiryDate = (id, expirationTime) => ({
  type: UPDATE_EXPIRY_DATE,
  id,
  expirationTime,
});
