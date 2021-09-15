import React, { useState } from "react";
import { Modal, StyleSheet, View, Text, Picker, Platform } from "react-native";
import { Icon, Button } from "react-native-elements";
import { fonts, metrics, theme } from "../../../../../constants";
import { i18n } from "../../../../../util";
import DurationSelector from "./DurationSelector";
import { blockPage } from "../../../../../store/actions/creators/UI";
import {
  addLink,
  updateLink,
  updateLinkExpiryDate,
} from "../../../../../store/actions/creators/sharedLinks";
import { useSelector, useDispatch } from "react-redux";
import { clearAllRecords } from "../../../../../store/actions/creators/records";
import { Doctor, Organization } from "../types";
import { useNavigation } from "@react-navigation/native";

export default (props) => {
  const { modalVisible, selectedLink, onClose, onUpdate, mode } = props;

  const sharedRecords = useSelector((state) => state.sharedRecords);
  const isEditMode = sharedRecords.editRecord.mode;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedPeriod, setSelectedPeriod] = useState(0);

  React.useEffect(() => {
    if (modalVisible) setSelectedPeriod(0);
  }, [modalVisible]);

  const duration = [
    <Picker.Item label={"Select Duration"} key={"0"} value={0} />,
    <Picker.Item label={"One Week"} key={"7"} value={7} />,
    <Picker.Item label={"Two Weeks"} key={"14"} value={14} />,
    <Picker.Item label={"Permanent"} key={"Permanent"} value={"Permanent"} />,
  ];

  const isPermanent = selectedPeriod === "Permanent";

  const AddSharedRecords = () => {
    onClose();
    let sharedData = {};
    for (const property in sharedRecords) {
      if (
        property !== "selectMode" &&
        property !== "editRecord" &&
        property !== Doctor &&
        property !== Organization &&
        sharedRecords[property].length
      ) {
        sharedData[property] = {};
        sharedData[property].notIn = [];
        sharedData[property].in = sharedRecords[property].map(
          (item) => item.id
        );
      }
    }
    dispatch(blockPage());
    dispatch(
      addLink({
        sharedItems: sharedData,
        expiresIn: getExpiryUpdateObject(),
        doctorIds: sharedRecords[Doctor].map((doctor) => doctor.id),
        isForever: isPermanent.toString(),
        shareAllItems: false,
      })
    )
      .then(() => {
        let params = {};
        params = {
          docID: sharedRecords[Doctor][0].id,
          name: sharedRecords[Doctor][0].name,
        };
        navigation.navigate("SharedLinks", params);
        dispatch(clearAllRecords());
      })
      .catch((err) => {});
  };

  const EditLink = () => {
    onClose();
    let sharedData = {};
    for (const property in sharedRecords) {
      if (
        property !== "selectMode" &&
        property !== "editRecord" &&
        property !== Doctor &&
        property !== Organization &&
        sharedRecords[property].length
      ) {
        sharedData[property] = {};
        sharedData[property].notIn = [];
        sharedData[property].in = sharedRecords[property].map(
          (item) => item.id
        );
      }
    }
    dispatch(blockPage());
    dispatch(
      updateLink({
        sharedItems: sharedData,
        link: sharedRecords.editRecord.linkID,
        expiresIn: getExpiryUpdateObject(),
        isForever: isPermanent.toString(),
      })
    )
      .then(() => {
        let params = {};
        if (!sharedRecords.editRecord.isFromAllLinksPage)
          params = {
            docID: sharedRecords[Doctor][0].id,
            name: sharedRecords[Doctor][0].name,
          };
        navigation.navigate("SharedLinks", params);
        dispatch(clearAllRecords());
      })
      .catch((err) => {});
  };

  const getExpiryUpdateObject = () => {
    return {
      years: 0,
      months: 0,
      days: selectedPeriod < 0 || isPermanent ? 0 : selectedPeriod,
      hours: 0,
      minutes: 0,
    };
  };

  const EditExpiryDate = () => {
    onClose();
    onUpdate();
    dispatch(
      updateLinkExpiryDate({
        linkId: selectedLink.link_id,
        expiresIn: getExpiryUpdateObject(),
        isForever: isPermanent.toString(),
      })
    )
      .then(() => {})
      .catch((err) => {});
  };

  const durationTitle =
    mode === "edit"
      ? i18n.t("records.shareRecords.editDuration")
      : i18n.t("records.shareRecords.duration");

  const submitHandler = () => {
    mode === "edit"
      ? EditExpiryDate()
      : isEditMode
      ? EditLink()
      : AddSharedRecords();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      visible={
        modalVisible &&
        (mode !== "edit" ||
          (selectedLink !== undefined && selectedLink !== null))
      }
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.header}>
              {i18n.t("records.shareRecords.durationTitle")}
            </Text>
            <Icon
              type="ionicon"
              name="ios-close"
              size={35}
              onPress={onClose}
              containerStyle={styles.closeIcon}
            />
          </View>
          <View style={styles.row}>
            <DurationSelector
              period={duration}
              title={durationTitle}
              selectedPreiod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
            />
          </View>
          <Button
            title={i18n.t("records.shareRecords.done")}
            buttonStyle={styles.button}
            titleStyle={styles.title}
            disabled={!selectedPeriod}
            onPress={submitHandler}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#00000088",
  },
  modalView: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  header: {
    fontFamily: fonts.MontserratBold,
    color: theme.colors.primary,
    fontSize: 26,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 80,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 20,
  },
  closeIcon: {
    position: "absolute",
    top: -5,
    right: 0,
    zIndex: 2,
    padding: 3,
  },
  row: {
    marginBottom: 15,
    marginHorizontal: 25,
  },
});
