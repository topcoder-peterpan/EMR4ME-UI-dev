import React from "react";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux/lib/hooks/useDispatch";
import { setSelectMode } from "../../store/actions/creators/records";
import { useSelector } from "react-redux";

export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectMode = useSelector((state) => state.sharedRecords.selectMode);

  const sharePressHandler = () => {
    dispatch(setSelectMode(true));
    navigation.navigate("ShareRecords");
  };

  return !selectMode && (
    <Icon
      name="md-share"
      type="ionicon"
      size={24}
      color="white"
      underlayColor="transparent"
      iconStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
      onPress={sharePressHandler}
    />
  );
};
