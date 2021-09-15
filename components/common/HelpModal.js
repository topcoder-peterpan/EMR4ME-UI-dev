import React from "react";
import { Button, Text, Icon } from "react-native-elements";

import { View, Modal } from "react-native";
import { theme, metrics, fonts } from "../../constants";
import { useDispatch } from "react-redux";
import { hideHelpPopup } from "../../store/actions/creators/UI";
import { StyleSheet } from "react-native";

export default (props) => {
  const { visible, title, message, leftButton } = props;
  const dispatch = useDispatch();

  const closeHandler = () => {
    dispatch(hideHelpPopup());
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
              <View style={styles.text}>{message}</View>
            </View>
            <View style={styles.buttonsContainer}>
              <Button
                title={leftButton.title}
                buttonStyle={{
                  ...styles.button,
                  backgroundColor: leftButton.color,
                }}
                titleStyle={styles.btnTitle}
                onPress={() => {
                  leftButton.pressHandler();
                  closeHandler();
                }}
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
  },
  title: {
    fontFamily: fonts.MontserratBold,
    color: theme.colors.primary,
    fontSize: 26,
  },
  closeIcon: {
    position: "absolute",
    top: -5,
    right: 0,
    zIndex: 2,
    padding: 3,
  },
  body: {
    marginTop: 20,
    minHeight: metrics.vh * 10,
    maxHeight: metrics.vh * 70,
    marginBottom: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 130,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
  },
  btnTitle: {
    fontSize: 18,
    color: "white",
    fontFamily: fonts.MontserratBold,
  },
  text: {},
});
