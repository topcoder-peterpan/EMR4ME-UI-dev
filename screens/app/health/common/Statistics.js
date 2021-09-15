
import React from 'react';
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { fonts, theme } from "./../../../../constants";
import { i18n } from "../../../../util";
import {
  getMaxElementIndex,
  getMaxValue,
  getMinElementIndex,
  getMinValue,
  mapFloat,
  mapFloatElement,
  toDate,
} from "../../../../util/common";

export default (props) => {
  const { data, decimalPlaces } = props;

  const latestRecord = data && data[0];
  const parsedData = mapFloat(data, "value");
  const latestValue = mapFloatElement(latestRecord.value, decimalPlaces);
  const highestValue = mapFloatElement(getMaxValue(parsedData) + "", decimalPlaces);
  const lowestValue = mapFloatElement(getMinValue(parsedData) + "", decimalPlaces);
  const maxElemIndex = getMaxElementIndex(parsedData);
  const minElemIndex = getMinElementIndex(parsedData);
  const unitToString = (unit) => unit && unit.length ? unit : "";

  return (
    <View style={styles.recordsContainer}>
      <Text style={styles.recordsHeader}>
        {i18n.t('records.content.records')}
      </Text>
      <View style={styles.latestRecordContainer}>
        <View>
          <Text style={styles.latestRecordText}>
            {i18n.t('health.temperature.latestRecord')}
          </Text>
          <Text>{latestRecord && latestRecord.record_date ? toDate(latestRecord.record_date) : ''}</Text>
          <Text style={styles.recordText}>
            {latestValue} {unitToString(latestRecord.unit)}
          </Text>
        </View>
      </View>
      <View style={styles.recordContainer}>
        <View>
          <Text style={styles.recordHeader}>
            {i18n.t('health.temperature.highestRecord')}
          </Text>
          <Text>
            {toDate(data[maxElemIndex].record_date)}
          </Text>
          <Text style={styles.recordText}>
            {highestValue} {unitToString(data[maxElemIndex].unit)}
          </Text>
        </View>
      </View>
      <View style={styles.recordContainer}>
        <View>
          <Text style={styles.recordHeader}>
            {i18n.t('health.temperature.lowestRecord')}
          </Text>
          <Text>
            {toDate(data[minElemIndex].record_date)}
          </Text>
          <Text style={styles.recordText}>
            {lowestValue} {unitToString(data[minElemIndex].unit)}
          </Text>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  recordsContainer: {
    marginTop: 20,
  },
  recordsHeader: {
    color: theme.colors.secondary,
    fontSize: 17,
    fontFamily: fonts.MontserratBold,
  },
  latestRecordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  latestRecordText: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontFamily: fonts.MontserratBold,
  },
  latestRecord: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: fonts.MontserratBold,
  },
  recordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  recordHeader: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontFamily: fonts.MontserratBold,
  },
  recordText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: fonts.MontserratBold,
    marginTop: 10,
  },
});
