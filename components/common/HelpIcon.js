import React, { useEffect } from "react";
import { Icon, Text } from "react-native-elements";
import { useDispatch } from "react-redux/lib/hooks/useDispatch";
import { hideHelpPopup, showHelpPopup } from "../../store/actions/creators/UI";
import { i18n } from "../../util";
import { theme } from "../../constants";
import ButtonAttributes from "./ButtonAttributes";
import { useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";

export default () => {
  const dispatch = useDispatch();
  const selectMode = useSelector((state) => state.sharedRecords.selectMode);

  useEffect(() => {
    return () => {
      hideHelpPopup();
    };
  }, []);

  const openHelpDialogue = () => {
    dispatch(
      showHelpPopup({
        msg: <View>
          <View style={styles.stepContainer}><Text style={styles.stepNumber}>1)</Text>
            <Text style={styles.stepText}>Choose Category.</Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2)</Text>
            <Text style={styles.stepText}>All items for this category will be displayed.</Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3)</Text>
            <Text style={styles.stepText}>Select Record(s) or Press All to select all records for the current category.</Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>4)</Text>
            <Text style={styles.stepText}>Close the current category, repeat the above steps to add items for another category.</Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>5)</Text>
            <Text style={styles.stepText}>Press Share Button.</Text>
          </View>
        </View>,
        title: i18n.t("records.shareRecords.helpTitle"),
        leftButton: new ButtonAttributes(
          i18n.t("records.shareRecords.ok"),
          () => { },
          theme.colors.primary
        ),
      })
    );
  };

  return selectMode && (
    <Icon
      name="md-help"
      type="ionicon"
      size={24}
      color="white"
      underlayColor="transparent"
      iconStyle={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        paddingRight: 20,
      }}
      onPress={openHelpDialogue}
    />
  );
};
const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  stepNumber: {
    color: theme.colors.primary,
    fontSize: 18,
  },
  stepText: {
    fontSize: 18,
    paddingLeft: 5
  }
})