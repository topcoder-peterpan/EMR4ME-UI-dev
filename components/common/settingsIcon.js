import React from "react";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default () => {
  const navigation = useNavigation();
  const selectMode = useSelector((state) => state.sharedRecords.selectMode);

  return (
    !selectMode && (
      <Icon
        name="md-settings"
        type="ionicon"
        size={24}
        color="white"
        underlayColor="transparent"
        iconStyle={{ paddingLeft: 10, paddingRight: 20, paddingVertical: 10 }}
        onPress={() => {
          navigation.navigate("Settings");
        }}
      />
    )
  );
};
