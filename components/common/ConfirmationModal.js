import React from "react";
import { Button, Text, Icon } from "react-native-elements";

import { View, Modal } from "react-native";
import { theme, metrics, fonts } from "../../constants";
import { useDispatch } from "react-redux";
import { hideConfirmDialogue } from "../../store/actions/creators/UI";
import { StyleSheet } from "react-native";
import { i18n } from "../../util";

export default (props) => {
  const { visible, title, message, note, leftButton, rightButton } = props;
  const dispatch = useDispatch();

  const closeHandler = () => {
    dispatch(hideConfirmDialogue());
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible || false}
        onDismiss={closeHandler}
        onRequestClose={closeHandler}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalTitle}>
              <Text style={styles.title}>{title}</Text>
              <Icon
                type="ionicon"
                name="ios-close"
                size={35}
                onPress={closeHandler}
                containerStyle={styles.closeIcon}
              />
            </View>
            <View style={styles.body}>
              <Text style={styles.text}>{message}</Text>
              <Text style={styles.subText}>{note}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <Button
                title={leftButton.title}
                buttonStyle={{ ...styles.button, backgroundColor: leftButton.color }}
                titleStyle={styles.btnTitle}
                onPress={() => {
                  leftButton.pressHandler();
                  closeHandler();
                }}
              />
              <Button
                title={rightButton ? rightButton.title : i18n.t("records.shareRecords.cancel")}
                buttonStyle={{
                  ...styles.button,
                  ...styles.cancelButton,
                  borderColor: rightButton ? rightButton.color : theme.colors.primary,
                }}
                titleStyle={[styles.btnTitle, { color: rightButton ? rightButton.color : theme.colors.primary }]}
                onPress={rightButton ? () => {
                  rightButton.pressHandler();
                  closeHandler();
                } : closeHandler}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    padding: 20,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  title: {
    textAlign: "center",
    fontFamily: fonts.MontserratBold,
    fontSize: 24,
    color: theme.colors.primary
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    padding: 3,
  },
  body: {
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 130,
    borderRadius: 25,
    backgroundColor: theme.colors.primary
  },
  btnTitle: {
    fontSize: 16,
    color: "white",
    fontFamily: fonts.MontserratBold,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF00',
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  text: {
    fontSize: 18
  },
  subText: {
    marginTop: 10,
    fontSize: 16
  }
});
