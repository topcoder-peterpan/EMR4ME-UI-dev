import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { Text, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  View,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
} from "react-native";
import { i18n } from "../../util";
import { theme, metrics } from "../../constants";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { inBetweenDates } from "../../util/common";
import ActionButton from "react-native-action-button";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default (props) => {
  useEffect(() => {
    Keyboard.dismiss();
  }, []);
  const {
    label,
    value,
    maxDate,
    minDate,
    setValue,
    defaultNull,
    flag,
    hasSelected,
  } = props;
  const [initValue, setInitValue] = useState(value);
  const inBetween = inBetweenDates(minDate, maxDate, value);
  const [visible, setVisiblity] = useState(false);
  const [outOfRange, setOutOfRange] = useState(
    maxDate && minDate ? !inBetween : false
  );
  const [dobText, setDobText] = useState(defaultNull ? undefined : value);
  const [mode, setMode] = useState("date");

  const onChange = (event, selectedDate) => {
    setVisiblity(Platform.OS === "ios");
    let newDate = new Date(selectedDate);
    // newDate.setHours(9);
    let UTC = moment.utc(newDate);
    let local = moment(UTC).local();
    const currentDate = local || value;
    if (
      inBetweenDates(minDate, maxDate, currentDate) &&
      new Date(selectedDate) >= new Date()
    ) {
      setValue(new Date(currentDate));
      setDobText(new Date(currentDate));
      if (hasSelected) hasSelected(true);
      setOutOfRange(false);
    } else {
      if (Platform.OS === "ios") {
        setValue(new Date(currentDate));
        setDobText(new Date(currentDate));
        setOutOfRange(maxDate && minDate ? true : false);
      }
    }
  };

  const showPicker = (type) => {
    Keyboard.dismiss();
    setVisiblity(true);
    setMode(type);
  };

  return (
    <>
      <View>
        <View>
          <View style={{ width: metrics.vw * 70 }}>
            <TouchableOpacity activeOpacity={0.9}>
              <Input
                autoCorrect={false}
                autoCompleteType="off"
                placeholderTextColor="#d3d3d3"
                placeholder={label}
                editable={false}
                value={dobText ? moment(dobText).format("L") : ""}
              />
            </TouchableOpacity>
          </View>
          <ActionButton
            buttonColor={theme.colors.primary}
            autoInactive={true}
            size={42}
            degrees={0}
            fixNativeFeedbackRadius={true}
            hideShadow={false}
            style={{
              marginBottom: -15,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 3,
            }}
            renderIcon={() => <Icon name="calendar" size={24} color="#FFF" />}
            onPress={() => showPicker("date")}
          />
        </View>
        <View>
          <View style={{ width: metrics.vw * 70 }}>
            <TouchableOpacity activeOpacity={0.9}>
              <Input
                autoCorrect={false}
                autoCompleteType="off"
                placeholderTextColor="#d3d3d3"
                placeholder={label}
                editable={false}
                value={dobText ? moment(dobText).format("LT") : ""}
              />
            </TouchableOpacity>
          </View>
          <ActionButton
            buttonColor={theme.colors.primary}
            autoInactive={true}
            size={42}
            degrees={0}
            fixNativeFeedbackRadius={true}
            hideShadow={false}
            style={{
              marginBottom: -15,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 3,
            }}
            renderIcon={() => <Icon name="clock-o" size={30} color="#FFF" />}
            onPress={() => showPicker("time")}
          />
        </View>
      </View>

      {Platform.OS === "ios" && (
        <Modal
          animationType="fade"
          transparent
          visible={visible}
          presentationStyle="overFullScreen"
          onDismiss={() => setVisiblity(false)}
          onRequestClose={() => setVisiblity(false)}
        >
          <View style={styles.iosModalContainer}>
            <View style={styles.iosPickerContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableWithoutFeedback style={styles.buttonReset} onPress={() => { setValue(initValue); onChange(null, initValue); }}>
                  <Text style={styles.buttonResetText}>{i18n.t('common.reset')}</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={styles.button} onPress={() => { if (!outOfRange) { onChange(null, value, true); setVisiblity(false) } }}>
                  <Text style={styles.buttonText}>{i18n.t('common.done')}</Text>
                </TouchableWithoutFeedback>
              </View>
              {outOfRange ? (
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text style={styles.error}>
                    {i18n.t("common.dateTimeOutofrange")}
                  </Text>
                </View>
              ) : null}
              <DateTimePicker
                style={{ width: "100%", backgroundColor: "white", marginTop: 15 }}
                testID="dateTimePicker"
                // timeZoneOffsetInMinutes={0}
                display="default"
                minimumDate={minDate}
                maximumDate={maxDate}
                value={value}
                mode={mode}
                display="default"
                textColor={"black"}
                onChange={onChange}
              />
            </View>
          </View>
        </Modal>
      )}
      {visible && Platform.OS === "android" && (
        <View>
          <DateTimePicker
            style={{ width: "100%" }}
            testID="dateTimePicker"
            // timeZoneOffsetInMinutes={0}
            display="default"
            minimumDate={minDate}
            maximumDate={maxDate}
            onTouchCancel={onChange}
            value={value}
            mode={mode}
            display="default"
            onChange={onChange}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iosModalContainer: {
    flex: 1,
    height: 100 * metrics.vh,
    backgroundColor: "rgba(0,0,0,.2)",
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  iosPickerContainer: {
    backgroundColor: "white",
    padding: 15,
    paddingBottom: 40,
  },
  error: {
    color: "red",
    fontSize: 15,
    padding: 15
  },
  button: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    color: "#fff",
    minWidth: metrics.vw * 25,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonReset: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderColor: theme.colors.primary,
    borderWidth: 1,
    color: theme.colors.primary,
    minWidth: metrics.vw * 25,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff"
  },
  buttonResetText: {
    color: theme.colors.primary
  }
});
