import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import { checkIfAnyRecordsSelected } from "../common";
import { theme } from "../../../../../constants";
import { useNavigation } from "@react-navigation/native";
import { Doctor, Organization } from "../types";
import ActionButton from "react-native-action-button";

const mapStateToProps = (state) => ({
  sharedRecords: state.sharedRecords,
});
export default memo(
  connect(mapStateToProps)((props) => {
    const { sharedRecords, type } = props;
    const selectMode = sharedRecords.selectMode;
    const navigation = useNavigation();

    const showButton = selectMode && checkIfAnyRecordsSelected(sharedRecords);
    const isCircle = type == Doctor || type == Organization;

    return showButton && !isCircle && (
      <ActionButton
        buttonColor={theme.colors.primary}
        style={styles.shareDocBtn}
        autoInactive={true}
        size={52}
        degrees={0}
        hideShadow={false}
        renderIcon={() => <Icon name="md-share" type="ionicon" color="#FFF" />}
        onPress={() => navigation.navigate("ShareRecords")}
      />
    );
  })
);
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "10%",
    bottom: 0,
  },
  button: {
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: 14,
  },
  shareDocBtn: {
    right: 10,
  },
});
