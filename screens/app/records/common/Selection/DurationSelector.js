import React from "react";
import { StyleSheet, View, Text, Picker } from "react-native";
import { metrics, theme } from "../../../../../constants";

export default (props) => {
  const { period, title, selectedPreiod, setSelectedPeriod } = props;

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedPreiod}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
      >
        {period}
      </Picker>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    color: theme.colors.primary,
    elevation: 10,
    zIndex: 10,
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FDFEFE",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
  },
  picker: {
    width: metrics.vw * 50,
    minWidth: 85,
  },
});
