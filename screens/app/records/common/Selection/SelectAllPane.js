import React from "react";
import { StyleSheet } from "react-native";
import { CheckBox, Text } from "react-native-elements";
import { connect, useDispatch } from "react-redux";
import { metrics, theme } from "../../../../../constants";
import {
  selectAllRecords,
  removeRecord,
} from "../../../../../store/actions/creators/records";
import CheckedCheckbox from "../../../../../assets/images/checked-checkbox.svg";
import UncheckedCheckbox from "../../../../../assets/images/unchecked-checkbox.svg";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import { LabResults, Notes } from "../types";
import { i18n } from "../../../../../util";

const mapStateToProps = (state) => ({
  sharedRecords: state.sharedRecords,
});
export default connect(mapStateToProps)((props) => {
  const { data, type, sharedRecords } = props;
  const currentTypeSharedList = sharedRecords[type] || [];
  let records = [];
  let allRecordsSelected = false;

  const setAllSelection = (list) => {
    allRecordsSelected = true;
    list.forEach((item) => {
      if (!currentTypeSharedList.some(i => i.id === item.id))
        allRecordsSelected = false;
      return;
    })
  };

  if (type === LabResults || type === Notes) {
    data.forEach((category) => {
      records = [...records, ...category.res];
    });
    setAllSelection(records);
  } else if (data)
    setAllSelection(data);

  const dispatch = useDispatch();


  const deselectRecords = (records) => {
    records.forEach(record => {
      dispatch(removeRecord(record, type));
    });
  }

  const selectAllOrNonePressHandler = () => {
    if (type === LabResults || type === Notes) {
      if (records.length === currentTypeSharedList.length)
        deselectRecords(records);
      else dispatch(selectAllRecords(records, type));
    } else {
      if (allRecordsSelected) deselectRecords(data);
      else dispatch(selectAllRecords(data, type));
    }
  };


  return (
    <Animatable.View
      style={styles.container}
      animation="fadeInDown"
      duration={500}
      useNativeDriver={true}
    >
      <TouchableWithoutFeedback onPress={selectAllOrNonePressHandler}>
        <Animatable.View
          onTouchStart={selectAllOrNonePressHandler}
          animation="fadeInLeft"
          duration={500}
          useNativeDriver={true}
          style={styles.selectAllContainer}
        >
          <CheckBox
                     containerStyle={{ marginBottom: 0 }}
            checkedIcon={<CheckedCheckbox width={16} />}
            uncheckedIcon={<UncheckedCheckbox width={16} />}
            checked={allRecordsSelected}
          />
          <Text style={styles.text}>
            {i18n.t("records.shareRecords.all")}
          </Text>
        </Animatable.View>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    justifyContent: "space-between",
    height: 5 * metrics.vh
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: theme.colors.secondary,
    fontWeight:'bold',
    fontSize: 20,
  },
});
