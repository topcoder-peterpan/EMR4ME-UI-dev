import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text, Icon } from "react-native-elements";
import { fonts, theme } from "./../../../../constants";

export default (props) => {
  const { children } = props;

  return (
    <TouchableOpacity style={styles.container}>
      <Icon
        type="entypo"
        name="circle-with-plus"
        size={30}
        color={theme.colors.primary}
      />
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontFamily: fonts.MontserratBold,
    marginHorizontal: 10,
  },
});
