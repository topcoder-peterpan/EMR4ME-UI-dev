import React from "react";
import { CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import CheckedCheckbox from "../../../../../assets/images/checked-checkbox.svg";
import UncheckedCheckbox from "../../../../../assets/images/unchecked-checkbox.svg";
import { View } from "react-native-animatable";

const mapStateToProps = (state) => ({
  sharedRecords: state.sharedRecords,
});
export default connect(mapStateToProps)((props) => {
  const { sharedRecords, itemSharedState, itemKey } = props;
  const selectMode = sharedRecords.selectMode;

  return selectMode && (
    <View
      animation="fadeInLeft"
      duration={500}
      useNativeDriver={true}
    >
      <CheckBox
        {...props}
         containerStyle={{ marginBottom: 0 }}
        disabled={true}
        key={itemKey}
        checkedIcon={<CheckedCheckbox width={16} />}
        uncheckedIcon={<UncheckedCheckbox width={16} />}
        checked={itemSharedState}
      />
    </View>
  );
});
