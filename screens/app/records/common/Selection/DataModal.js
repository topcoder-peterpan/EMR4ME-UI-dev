import React from "react";
import { Modal, StyleSheet, View, Text, Platform } from "react-native";
import { Icon } from "react-native-elements";
import ActionButton from "react-native-action-button";
import { fonts, metrics, theme } from "../../../../../constants";

export default (props) => {
  const { modalVisible, onClose, children, title } = props;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.header}>{title}</Text>
            <Icon
              type="ionicon"
              name="ios-close"
              size={35}
              onPress={onClose}
              containerStyle={styles.closeIcon}
            />
          </View>
          {children}
          <ActionButton
            buttonColor={"green"}
            autoInactive={true}
            shadowStyle={styles.confrimButton}
            size={52}
            degrees={0}
            hideShadow={false}
            renderIcon={() => (
              <Icon name="md-checkmark" type="ionicon" color="#FFF" />
            )}
            onPress={onClose}
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
    padding: 20,
    paddingLeft: 0,
    paddingTop: 20,
    height: metrics.vh * 75,
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
    marginBottom: 10
  },
  header: {
    fontFamily: fonts.MontserratBold,
    fontSize: 22,
    color: theme.colors.secondary
  },
  closeIcon: {
    position: "absolute",
    top: -5,
    right: 0,
    zIndex: 2,
    padding: 3,
  },
  confrimButton: {
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});
