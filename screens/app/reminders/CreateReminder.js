import React, { useEffect, useState } from "react";
import {
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Picker,
  Switch,
  TextInput,
} from "react-native";
import {
  ThemeConsumer,
  Text,
  Icon,
  Input,
  Button,
} from "react-native-elements";
import DateTimePicker from "../../../components/common/reminder-date-time-picker";

import Pills from "../../../assets/images/pills.svg";
import { fonts, metrics, theme } from "../../../constants";
import { i18n } from "../../../util";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  addReminder,
  getAllMedications,
  updateReminder,
} from "../../../store/actions/creators/user";
import {
  showAlert,
  showHelpPopup,
  startLoading,
} from "../../../store/actions/creators/UI";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import ButtonAttributes from "../../../components/common/ButtonAttributes";
import Loader from "../../../components/common/awesome-Loader";
import ReminderTitle from "./ReminderTitle";
import { addReminderToDB, deleteReminderFromDB } from "./DataAccessLayer";
import Select2 from "../../../components/common/Select2/index";

let freqList = [
  { id: "1", name: "Once" },
  { id: "2", name: "Twice" },
  { id: "3", name: "3 Times" },
];

export default (props) => {
  let today = new Date();
  let startDateMaxVal = new Date();
  startDateMaxVal.setFullYear(startDateMaxVal.getFullYear() + 2);

  const reminderID =
    (props &&
      props.route &&
      props.route.params &&
      props.route.params.reminder_id) ||
    null;
  const isEditMode = !!reminderID;
  const reminder = props.route.params;
  let initialTitle = isEditMode
    ? reminder.reminder_title.indexOf("\n") === -1
      ? reminder.reminder_title
      : reminder.reminder_title.substr(
          0,
          reminder.reminder_title.lastIndexOf("\n")
        )
    : "";
  let initialFreq = isEditMode ? reminder.frequency_per_day.toString() : null;
  let initialStartDate = isEditMode ? new Date(reminder.start_date) : today;
  let initialEndDate = isEditMode
    ? new Date(reminder.end_date)
    : new Date(new Date(today).setMonth(today.getMonth() + 2));

  const [title, setTitle] = useState(initialTitle);
  const [frequency, setFrequency] = useState(initialFreq);
  const [selectedMinDate, setSelectedMinDate] = useState(initialStartDate);
  const [selectedMaxDate, setSelectedMaxDate] = useState(initialEndDate);
  const [isCustom, setIsCustom] = useState(isEditMode);
  const [medicationPicker, setMedicationPicker] = useState();
  const [medicationTitle, setMedicationTitle] = useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [medicationsList, setMedicationsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [disableSwitch, setDisableSwitch] = useState(false);

  // let lastNotificationDate = null;
  const minDate =
    isEditMode && reminder.start_date < today
      ? new Date(reminder.start_date)
      : today;
  let endDateMaxVal = new Date(selectedMinDate).setMonth(
    selectedMinDate.getMonth() + 2
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector(
    (state) =>
      state.user && state.user.userData && state.user.userData.userModel
  );

  const userID = user && user.user_id;
  const userName = user && user.fname + " " + user.lname;

  const toggleSwitch = () => setIsCustom((previousState) => !previousState);

  const resetMedicationPicker = () => {
    setMedicationTitle("");
    setMedicationPicker();
    let chosenMedication = medicationsList.find((m) => m.checked);
    if (chosenMedication) chosenMedication.checked = false;
  };

  const insertReminder = () => {
    dispatch(startLoading());
    // dispatch(blockPage());
    let scheduledNotifications = [];
    const msg = isCustom ? title : medicationTitle;
    let timeDelta = 24 / frequency;
    let nextReminder = selectedMinDate;
    while (nextReminder <= selectedMaxDate) {
      scheduledNotifications.push({
        schedule_time: new Date(nextReminder),
      });
      // lastNotificationDate = nextReminder;
      nextReminder = moment(nextReminder).add(timeDelta, "hours");
    }
    if (!scheduledNotifications.length) {
      dispatch(
        showAlert({
          msg: i18n.t("reminder.datesError"),
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
      return;
    }
    if (isEditMode) {
      updateReminder({
        reminder_id: reminder.reminder_id,
        is_active: reminder.is_active,
        reminder_title: reminder.reminder_title,
        start_date: new Date(selectedMinDate),
        end_date: new Date(selectedMaxDate),
        frequency_per_day: frequency,
        user_id: userID.toString(),
        schedules: scheduledNotifications,
      })
        .then((response) => {
          if (response.statusCode == 0) {
            dispatch(startLoading());
            deleteReminderFromDB(reminder, () => {
              addReminderToDB(response.payload, () => {
                dispatch(
                  showAlert({
                    msg: i18n.t("reminder.updateSuccess"),
                    type: "success",
                    present: false,
                    iconName: "check",
                  })
                );
                navigation.navigate("Reminders");
              });
            });
          } else {
            dispatch(
              showAlert({
                msg: i18n.t("common.serverError"),
                type: "error",
                present: false,
                iconName: "warning",
              })
            );
          }
        })
        .catch((error) => {
          dispatch(
            showAlert({
              msg: i18n.t("common.serverError"),
              type: "error",
              present: false,
              iconName: "warning",
            })
          );
        });
      // });
    } else {
      addReminder({
        reminder_title: msg + `\nFor: ${userName}`,
        start_date: new Date(selectedMinDate),
        end_date: new Date(selectedMaxDate),
        frequency_per_day: frequency,
        user_id: userID.toString(),
        schedules: scheduledNotifications,
      })
        .then((response) => {
          if (response.statusCode == 0) {
            dispatch(startLoading());
            addReminderToDB(response.payload, () => {
              dispatch(
                showAlert({
                  msg: i18n.t("reminder.addSuccess"),
                  type: "success",
                  present: false,
                  iconName: "check",
                })
              );
              navigation.navigate("Reminders");
            });

            // response.payload.schedules.forEach((schedule, i) => {
            //   scheduleNotification(
            //     response.payload.user_id,
            //     response.payload.user_id + "_" + schedule.schedule_id,
            //     response.payload.reminder_title,
            //     schedule.schedule_time
            //   );
            // });
            // scheduleNotification(
            //   response.payload.user_id,
            //   response.payload.user_id +
            //     "_" +
            //     response.payload.reminder_id +
            //     "_last",
            //   "This scheduled medication reminders has expired",
            //   new Date(lastNotificationDate)
            // );
          } else {
            dispatch(
              showAlert({
                msg: i18n.t("common.serverError"),
                type: "error",
                present: false,
                iconName: "warning",
              })
            );
          }
        })
        .catch((error) => {
          dispatch(
            showAlert({
              msg: i18n.t("common.serverError"),
              type: "error",
              present: false,
              iconName: "warning",
            })
          );
        });
    }
  };

  const isLoading = useSelector((state) => state.UI.isLoading);

  useEffect(() => {
    freqList = [
      { id: "1", name: "Once" },
      { id: "2", name: "Twice" },
      { id: "3", name: "3 Times" },
    ];
    const initiallySelectedFreq = freqList.find((f) => f.id === frequency);
    if (initiallySelectedFreq) initiallySelectedFreq.checked = true;
    getAllMedications().then((data) => {
      setLoaded(true);
      if (data.payload.success) setMedicationsList(data.payload.payload);
      else {
        setMedicationsList([]);
        if (!isEditMode) {
          setIsCustom(true);
          setDisableSwitch(true);
          if (loaded) {
            dispatch(
              showHelpPopup({
                msg: (
                  <Text style={{ fontSize: 18 }}>
                    {i18n.t("reminder.noMedications")}
                  </Text>
                ),
                title: i18n.t("records.shareRecords.helpTitle"),
                leftButton: new ButtonAttributes(
                  i18n.t("records.shareRecords.ok"),
                  () => {},
                  theme.colors.primary
                ),
              })
            );
          }
        }
      }
    });
  }, [loaded]);

  if (!loaded || isLoading) return <Loader />;
  else
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <>
            <StatusBar
              backgroundColor={theme.colors.primary}
              barStyle="light-content"
            />
            <SafeAreaView style={styles.container}>
              <ScrollView contentContainerStyle={{ padding: 30 }}>
                <View style={{ alignItems: "center" }}>
                  <Pills />
                </View>
                {!isEditMode && (
                  <View>
                    <Text style={styles.labelText}>Type</Text>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor: "#EAEAEA",
                        paddingBottom: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 15,
                      }}
                    >
                      <Text
                        style={[
                          styles.labelText,
                          styles.costumLabel,
                          {
                            color: disableSwitch
                              ? "lightgrey"
                              : theme.colors.primary,
                          },
                        ]}
                      >
                        Medication
                      </Text>
                      <Switch
                        trackColor={{
                          true: theme.colors.success,
                          false: theme.colors.primary,
                        }}
                        disabled={disableSwitch}
                        ios_backgroundColor={theme.colors.primary}
                        thumbColor={isCustom ? "#32cd32" : theme.colors.primary}
                        onValueChange={toggleSwitch}
                        value={isCustom}
                      />
                      <Text
                        style={[
                          styles.labelText,
                          styles.costumLabel,
                          { color: theme.colors.success },
                        ]}
                      >
                        Custom
                      </Text>
                    </View>
                  </View>
                )}
                {
                  <View style={styles.row}>
                    {isCustom ? (
                      <Input
                        autoCorrect={false}
                        autoCompleteType="off"
                        maxLength={50}
                        disabled={isEditMode}
                        placeholder={"Title (Required)"}
                        placeholderTextColor="#d3d3d3"
                        leftIcon={
                          <Icon
                            name="pill"
                            type="material-community"
                            size={20}
                            color={theme.colors.secondary}
                          />
                        }
                        value={title}
                        onChangeText={(value) => {
                          setTitle(value);
                        }}
                      />
                    ) : medicationTitle ? (
                      <>
                        <View style={styles.labelContainer}>
                          <Text style={[styles.labelText, styles.costumLabel]}>
                            Title
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "72%",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                          }}
                        >
                          <TextInput
                            autoCorrect={false}
                            multiline
                            autoCompleteType="off"
                            editable={false}
                            value={medicationTitle}
                            onChangeText={(value) => {
                              setMedicationTitle(value.substring(0, 39));
                            }}
                          />
                          <Icon
                            name="autorenew"
                            type="material-community"
                            size={30}
                            color={theme.colors.secondary}
                            onPress={() => {
                              resetMedicationPicker();
                            }}
                          />
                        </View>
                      </>
                    ) : (
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: "#EAEAEA",
                          paddingBottom: 15,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 15,
                        }}
                      >
                        <View style={styles.labelContainer}>
                          <Text style={[styles.labelText, styles.costumLabel]}>
                            Title
                          </Text>
                        </View>
                        <View style={styles.picker}>
                          <Select2
                            isSelectSingle
                            style={{ borderRadius: 5 }}
                            popupTitle="Select Medication"
                            title="Select Medication"
                            showSearchBox={false}
                            data={medicationsList}
                            selectCallback={() => setModalVisible(true)}
                            onSelect={(data) => {
                              if (data.length) {
                                let medication = medicationsList.find(
                                  (m) => m.id === data[0]
                                );
                                let medicationName =
                                  medication && medication.name
                                    ? medication.name
                                    : "";
                                setMedicationPicker(medicationName);
                                // setModalVisible(true);
                                if (Platform.OS === "android")
                                  setModalVisible(true);
                                // else
                                //   setTimeout(() => {
                                //     setModalVisible(true);
                                //   }, 600);
                              } else {
                                setMedicationPicker();
                              }
                            }}
                            onRemoveItem={(data) => {
                              setMedicationPicker(data[0]);
                            }}
                          />
                          {/* <Picker
                            selectedValue={medicationPicker}
                            style={[
                              {
                                flexGrow: 1,
                              },
                              Platform.OS === "android" && styles.androidHeight,
                            ]}
                            itemStyle={{ marginLeft: 10 }}
                            onValueChange={(itemValue) => {
                              if (itemValue) {
                                setMedicationPicker(itemValue);
                                // setMedicationTitle(
                                //   "Medication-" + itemValue.substring(0, 39)
                                // );
                                setModalVisible(true);
                              } else {
                                setMedicationPicker("");
                                // setMedicationTitle("");
                              }
                            }}
                          >
                            <Picker.Item
                              label={"Select Medication"}
                              key={"0"}
                              value={0}
                            />
                            {medicationsList.map((medication) => (
                              <Picker.Item
                                label={medication.name}
                                value={medication.name}
                              />
                            ))}
                          </Picker> */}
                        </View>
                      </View>
                    )}
                  </View>
                }

                <View style={[styles.row, { paddingHorizontal: 5 }]}>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 5,
                    }}
                  >
                    <View style={styles.filterChecksContainer}></View>
                    <View style={styles.filterRow}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>From</Text>
                      </View>
                      <View style={styles.picker}>
                        <DateTimePicker
                          label={i18n.t("common.minDate")}
                          value={selectedMinDate}
                          setValue={setSelectedMinDate}
                          maxDate={startDateMaxVal}
                          minDate={minDate}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={[styles.row, { paddingHorizontal: 5 }]}>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 5,
                    }}
                  >
                    <View style={styles.filterChecksContainer}></View>
                    <View style={styles.filterRow}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>To</Text>
                      </View>
                      <View style={styles.picker}>
                        <DateTimePicker
                          label={i18n.t("common.maxDate")}
                          value={selectedMaxDate}
                          setValue={setSelectedMaxDate}
                          maxDate={endDateMaxVal}
                          minDate={today}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={[styles.row]}>
                  <View
                    style={[
                      {
                        borderBottomWidth: 1,
                        borderColor: "#EAEAEA",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 5,
                        paddingBottom: 15,
                      },
                    ]}
                  >
                    <View style={styles.labelContainer}>
                      <Text style={[styles.labelText, styles.costumLabel]}>
                        Repeat
                      </Text>
                    </View>
                    <View style={styles.picker}>
                      <Select2
                        isSelectSingle
                        style={{ borderRadius: 5 }}
                        showSearchBox={false}
                        popupTitle="Select Frequency"
                        title="Select Frequency"
                        data={freqList}
                        onSelect={(data) => {
                          setFrequency(data[0]);
                        }}
                        onRemoveItem={(data) => {
                          setFrequency(data[0]);
                        }}
                      />
                      {/* <Picker
                        selectedValue={frequency}
                        style={[
                          {
                            flexGrow: 1,
                          },
                          Platform.OS === "android" && styles.androidHeight,
                        ]}
                        itemStyle={{ marginLeft: 10 }}
                        onValueChange={(itemValue, _) =>
                          setFrequency(itemValue)
                        }
                      >
                        <Picker.Item label="once" value="1" />
                        <Picker.Item label="twice" value="2" />
                        <Picker.Item label="3 times" value="3" />
                      </Picker> */}
                    </View>
                  </View>
                </View>
                <Button
                  disabled={
                    (isCustom && !title) ||
                    selectedMaxDate < selectedMinDate ||
                    (!isCustom && !medicationTitle) ||
                    !frequency ||
                    isLoading
                  }
                  title={
                    isEditMode ? i18n.t("common.update") : i18n.t("common.add")
                  }
                  containerStyle={{ marginTop: 40 }}
                  onPress={insertReminder}
                />
              </ScrollView>
              <ReminderTitle
                title={medicationPicker}
                setTitle={setMedicationTitle}
                modalVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                reset={resetMedicationPicker}
              />
            </SafeAreaView>
          </>
        )}
      </ThemeConsumer>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -10,
    marginVertical: 10,
  },
  filterCheckContainer: {
    padding: 0,
    marginLeft: 0,
    marginRight: "3%",
    flexBasis: "44%",
    flexWrap: "wrap",
    overflow: "scroll",
    backgroundColor: "#FFF",
    borderWidth: 0,
    marginVertical: 8,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterChecksContainer: {
    height: 10 * metrics.vh,
    flexDirection: "column",
    marginTop: 10,
  },
  labelContainer: {
    width: "25%",
  },
  picker: {
    width: "75%",
  },
  labelText: {
    fontFamily: fonts.MontserratBold,
    color: theme.colors.secondary,
  },
  costumLabel: {
    paddingHorizontal: 6,
  },
  iosHeight: {
    height: 200,
  },
  androidHeight: {
    height: 50,
  },
});
