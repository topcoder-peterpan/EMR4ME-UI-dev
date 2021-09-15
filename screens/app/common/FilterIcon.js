import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text, Icon } from "react-native-elements";
import { theme, fonts } from "./../../../constants";
import { i18n } from "../../../util";

export default (props) => {
  const { openFilterModal } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={openFilterModal}>
      <Icon
        type="material"
        name="filter-list"
        size={30}
        color={theme.colors.primary}
      />
      <Text style={styles.text}>{i18n.t("common.filter")}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
  },
  text: {
    color: theme.colors.primary,
    fontSize: 13,
    fontFamily: fonts.MontserratBold,
  },
});
