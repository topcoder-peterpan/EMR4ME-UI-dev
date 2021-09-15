import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { fonts } from "../../../../../constants";
import { DataContext } from "../../../../../components/common/DataContext";
import { toDateText } from "../../../../../util/common";

export default (props) => {
  const { item } = props;

  const {
    opacity,
    headerProp,
    contentProp,
    themeColor,
  } = React.useContext(DataContext);


  return (
    <TouchableOpacity
      {...props}
      disabled={true}
      style={[styles.card, { borderColor: themeColor }]}
      key={item.id && String(item.id) ? String(item.id) : item.id}
      activeOpacity={opacity}
    >
      <View style={[styles.cardHeader, { backgroundColor: themeColor }]}>
        <Text style={styles.cardHeaderText}>{item[headerProp]}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text>{item[contentProp]}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 15,
  },
  cardHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBody: {
    padding: 15,
  },
  cardHeaderText: {
    fontFamily: fonts.MontserratBold,
    fontSize: 18,
    color: "#FFF",
  },
});
