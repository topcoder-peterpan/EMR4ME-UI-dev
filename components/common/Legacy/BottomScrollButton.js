import React from "react";
import {  StyleSheet } from "react-native";
import {  Avatar } from "react-native-elements";
import { theme } from "../../../constants";

export default (props) => {
  const { scrollView } = props;
  const scrollToBottom = () => {
    if (scrollView && scrollView.current)
      scrollView.current.scrollToEnd({ animated: true });
  };

  return (
    <Avatar
      rounded
      icon={{
        name: "angle-double-down",
        type: "font-awesome",
        color: "white",
        size: 30,
      }}
      onPress={scrollToBottom}
      overlayContainerStyle={{ backgroundColor: theme.colors.primary }}
      activeOpacity={0.7}
      size="medium"
      containerStyle={styles.icon}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    bottom: 40,
    right: 40,
    zIndex: 2,
  },
});
