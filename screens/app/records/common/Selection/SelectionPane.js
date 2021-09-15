import React, { useEffect, useState } from "react";
import { StyleSheet, BackHandler, Text } from "react-native";
import { Button } from "react-native-elements";
import { connect, useDispatch, useSelector } from "react-redux";
import { theme } from "../../../../../constants";
import {
  clearAllRecords,
  setRecords,
  setSelectMode,
} from "../../../../../store/actions/creators/records";
import * as Animatable from "react-native-animatable";
import { Doctor, Organization } from "../types";
import {
  showConfirmDialogue,
  showHelpPopup,
} from "../../../../../store/actions/creators/UI";
import { i18n } from "../../../../../util";
import { checkIfAnyRecordsSelected } from "../common";
import { useNavigation } from "@react-navigation/native";
import ExpiryDateModal from "./ExpiryDateModal";
import ButtonAttributes from "../../../../../components/common/ButtonAttributes";
import {
  addLink,
  getAllLinks,
  getLinkByID,
} from "../../../../../store/actions/creators/sharedLinks";
import {
  addSharedOrganization,
  getUserSharedOrganizations,
} from "../../../../../store/actions/creators/organization";

const mapStateToProps = (state) => ({
  sharedRecords: state.sharedRecords,
  isSignout: state.user.isSignout,
});
export default connect(mapStateToProps)((props) => {
  const { type, sharedRecords, isSignout } = props;
  const selectMode = sharedRecords.selectMode;

  const [modalVisible, setModalVisible] = useState(false);

  const isCircle = type === Doctor || type === Organization;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  let noChangesInEditMode = !useSelector(
    (state) => state.sharedRecords.editRecord.enableShare
  );

  useEffect(() => {
    if (isSignout) setModalVisible(false);
  }, [isSignout]);

  const cancelShare = () => {
    navigation.navigate("Health");
    dispatch(clearAllRecords());
  };

  const cancelSharePressHandler = () => {
    dispatch(
      showConfirmDialogue({
        msg: i18n.t("records.shareRecords.confirmCancelShare"),
        title: i18n.t("records.shareRecords.cancelShareTitle"),
        leftButton: new ButtonAttributes(
          i18n.t("records.shareRecords.confirm"),
          cancelShare,
          theme.colors.danger
        ),
      })
    );
  };

  const handleBackButtonClick = () => {
    if (!selectMode) navigation.goBack();
    else cancelSharePressHandler();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () =>
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
  }, [selectMode]);

  const getExpiryUpdateObject = () => {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
    };
  };

  const shareAllRecords = () => {
    dispatch(
      addLink({
        sharedItems: {},
        expiresIn: getExpiryUpdateObject(),
        doctorIds: sharedRecords[Doctor].map((doctor) => doctor.id),
        isForever: true,
        shareAllItems: true,
      })
    )
      .then(() => {
        navigation.navigate("SharedLinks", { tabIndex: 0 });
        dispatch(clearAllRecords());
      })
      .catch((err) => { });
  };

  const shareAllRecordsWithOrganization = () => {
    addSharedOrganization({
      organizationIds: sharedRecords[Organization].map((org) => org.id),
    })
      .then((data) => {
        if (data.statusCode == 0) {
          navigation.navigate("SharedLinks", { tabIndex: 1 });
          dispatch(clearAllRecords());
        } 
      })
      .catch((err) => { });
  };

  const shareWithDoctor = () => {
    getAllLinks({ doctor_id: sharedRecords[Doctor][0].id })
      .then((data) => {
        if (data.statusCode == 0) {
          let createdLink = data.payload.find(
            (link) => link.doctor_id == sharedRecords[Doctor][0].id
          );
          if (createdLink) {
            getLinkByID({ linkId: createdLink.link_id })
              .then((data) => {
                if (data.statusCode == 0) {
                  let item = data.payload;
                  let sharedData = {};
                  let doctorName = sharedRecords[Doctor][0].name;
                  sharedData[Doctor] = [
                    { id: parseInt(item.doctor_id), name: doctorName },
                  ];
                  for (const property in item.shared_items) {
                    if (item.shared_items[property].in) {
                      sharedData[property] = item.shared_items[property].in.map(
                        (item) => {
                          if (typeof item === "object") return item;
                          else return { id: item };
                        }
                      );
                    }
                  }
                  dispatch(setRecords(item.link_id, sharedData, false));
                  navigation.navigate("Records", { screen: "RecordScreen" });
                }
              })
              .catch((err) => { });
          } else {
            dispatch(
              showConfirmDialogue({
                msg: i18n.t("records.shareRecords.confirmProceedShare"),
                note: i18n.t("records.shareRecords.shareNote"),
                title: i18n.t("records.shareRecords.proceedShareTitle"),
                leftButton: new ButtonAttributes(
                  i18n.t("records.shareRecords.customize"),
                  () => {
                    navigation.navigate("Records", {
                      screen: "RecordScreen",
                    });
                    dispatch(setSelectMode(true));
                  },
                  theme.colors.primary
                ),
                rightButton: new ButtonAttributes(
                  i18n.t("records.shareRecords.proceed"),
                  shareAllRecords,
                  theme.colors.success
                ),
              })
            );
          }
        }
      })
      .catch((err) => { });
  };

  const shareWithOrganization = () => {
    getUserSharedOrganizations()
      .then((data) => {
        if (data.statusCode == 0) {
          let createdLink = data.payload.find(
            (link) => link.organization_id == sharedRecords[Organization][0].id
          );
          if (createdLink) {
            openAlreadySharedPopup();
          } else {
            dispatch(
              showConfirmDialogue({
                msg: i18n.t("records.shareRecords.confirmProceedShare"),
                note: i18n.t("records.shareRecords.shareNote"),
                title: i18n.t("records.shareRecords.proceedShareTitle"),
                leftButton: new ButtonAttributes(
                  i18n.t("records.shareRecords.cancel"),
                  () => {
                    setModalVisible(false);
                  },
                  theme.colors.error
                ),
                rightButton: new ButtonAttributes(
                  i18n.t("records.shareRecords.proceed"),
                  shareAllRecordsWithOrganization,
                  theme.colors.success
                ),
              })
            );
          }
        }
      })
      .catch((err) => { });
  };

  const openAlreadySharedPopup = () => {
    dispatch(
      showHelpPopup({
        msg: (
          <Text style={{ fontSize: 18 }}>
            {i18n.t("records.shareRecords.alreadySharedOrganization")}
          </Text>
        ),
        title: i18n.t("records.shareRecords.note"),
        leftButton: new ButtonAttributes(
          i18n.t("records.shareRecords.ok"),
          () => { },
          theme.colors.primary
        ),
      })
    );
  };

  const sharePressHandler = () => {
    if (type === Doctor) shareWithDoctor();
    else if (type === Organization) shareWithOrganization();
    else setModalVisible(true);
  };

  const hasSelectedCircle =
    selectMode &&
    (checkIfAnyRecordsSelected(sharedRecords, Doctor) ||
      checkIfAnyRecordsSelected(sharedRecords, Organization));
  const hasSelectedRecords =
    selectMode && checkIfAnyRecordsSelected(sharedRecords);

  return (
    <>
      <ExpiryDateModal
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {selectMode && (
        <Animatable.View
          style={styles.container}
          animation="fadeInDown"
          duration={500}
          useNativeDriver={true}
        >
          <Button
            title={i18n.t("records.shareRecords.share")}
            disabled={
              ((!hasSelectedRecords || noChangesInEditMode) && !isCircle) ||
              (isCircle && !hasSelectedCircle)
            }
            buttonStyle={{ ...styles.button, ...styles.shareButton }}
            titleStyle={styles.btnTitle}
            onPress={sharePressHandler}
          />
          <Button
            title={i18n.t("records.shareRecords.cancel")}
            buttonStyle={{ ...styles.button, ...styles.closeBtn }}
            titleStyle={[styles.btnTitle, styles.cancelButtonTitle]}
            type="outline"
            onPress={cancelSharePressHandler}
          />
        </Animatable.View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  button: {
    minWidth: 100,
    maxWidth: 150,
  },
  shareButton: {
    paddingVertical: 10,
    backgroundColor: "green",
  },
  closeBtn: {
    paddingVertical: 8,
    backgroundColor: "#FFFFFF00",
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  btnTitle: {
    fontSize: 13,
  },
  cancelButtonTitle: {
    color: theme.colors.error,
  },
  text: {
    color: theme.colors.secondary,
    fontSize: 18,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  stepNumber: {
    color: theme.colors.primary,
    fontSize: 18,
  },
  stepText: {
    fontSize: 18,
    paddingLeft: 5,
  },
});
