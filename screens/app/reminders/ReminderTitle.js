import React, { useState } from "react";
import { Platform } from "react-native";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
} from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import { fonts, theme } from "../../../constants";
import { i18n } from "../../../util";

export default (props) => {
  const { modalVisible, onClose, title, setTitle, reset } = props;

  const [inputTitle, setInputTitle] = useState("Medication-" + title);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (modalVisible) {
      setInputTitle("Medication-" + title);
      if (Platform.OS === "android")
        setTimeout(() => {
          if (inputRef && inputRef.current) inputRef.current.focus();
        }, 150);
    }
  }, [modalVisible]);

  const submitHandler = () => {
    setTitle(inputTitle);
    onClose();
  };

  const resetMedication = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={resetMedication}
      visible={modalVisible}
      onModalShow={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.header}>{i18n.t("reminder.title")}</Text>
            <Icon
              type="ionicon"
              name="ios-close"
              size={35}
              onPress={resetMedication}
              containerStyle={styles.closeIcon}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              autoCorrect={false}
              multiline
              ref={inputRef}
              autoFocus={Platform.OS === "ios"}
              autoCompleteType="off"
              maxLength={50}
              // leftIcon={
              //   <Icon
              //     name="pill"
              //     type="material-community"
              //     size={20}
              //     color={theme.colors.secondary}
              //   />
              // }
              value={inputTitle}
              onChangeText={(value) => {
                setInputTitle(value);
              }}
            />
          </View>
          <Button
            title={i18n.t("records.shareRecords.done")}
            buttonStyle={styles.button}
            titleStyle={styles.title}
            onPress={submitHandler}
            disabled={!inputTitle.length}
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
    paddingHorizontal: 5,
    backgroundColor: "#00000088",
  },
  modalView: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 15,
    paddingVertical: 25,
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
    right: 20,
    zIndex: 2,
    padding: 3,
  },
  row: {
    marginBottom: 15,
    marginHorizontal: 25,
  },
});
