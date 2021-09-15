import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";

export default (props) => {
  const navigation = useNavigation();
  const { tintColor } = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: 0,
      }}
      onPress={() => navigation.goBack()}
    >
      <Icon name={"chevron-left"} size={40} color={tintColor} />
    </TouchableOpacity>
  );
};
