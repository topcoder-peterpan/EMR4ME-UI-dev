import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  Animated as Animatable,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Swipeable,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import ButtonAttributes from "../../../components/common/ButtonAttributes";
import { metrics, theme, fonts } from "../../../constants";
import { startLoading } from "../../../store/actions/creators";
import {
  showAlert,
  showConfirmDialogue,
  showHelpPopup,
} from "../../../store/actions/creators/UI";
import {
  deleteReminder,
  getReminders,
} from "../../../store/actions/creators/user";
import { i18n } from "../../../util";
import Loader from "../../../components/common/awesome-Loader";
import SharedLinksBottomSheet from "../records/common/BottomSheet/SharedLinksBottomSheet";
import { ListItem, Icon, Text } from "react-native-elements";
import moment from "moment";
import NoDataScreen from "../../../components/common/NoData";
import ActionButton from "react-native-action-button";
import PushNotification from "react-native-push-notification";
import {
  addRemindersListToDB,
  deleteReminderFromDB,
  deleteUserRemindersListFromDB,
} from "./DataAccessLayer";
import { scheduleReminders } from "./RemindersSchedule";
import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(false);
SQLite.DEBUG(true);

// const errorCB = (err) => {
//   console.log("error: ", err);
//   return false;
// }

// const openCB = () => {
// }

// const database_name = "Test.db";
// const database_version = "1.0";
// const database_displayname = "SQLite Test Database";
// const database_size = 200000;
// const db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, openCB, errorCB);

const db = SQLite.openDatabase(
  {
    name: "StgNotificationDB",
    location: "default",
  },
  () => {},
  (error) => {
    console.log(error);
  }
);

export default (props) => {
  const { navigation } = props;
  const [reminders, setReminders] = useState([]);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [
    deviceScheduledNotififcations,
    setDeviceScheduledNotififcations,
  ] = React.useState([]);

  const selectedReminder = useRef();
  let bottomSheet = useRef();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.UI.isLoading);

  const user = useSelector(
    (state) =>
      (state.user && state.user.userData && state.user.userData.userModel) ||
      null
  );

  const userID = user && user.user_id;

  const closeBottomSheet = () => {
    selectedReminder.current = null;
    bottomSheet.current.snapTo(1);
    setShowBackDrop(false);
  };

  const openBottomSheet = (item) => {
    selectedReminder.current = item;
    bottomSheet.current.snapTo(0);
    setShowBackDrop(true);
  };

  const fetchReminders = () => {
    getReminders({ user_id: userID.toString() })
      .then((data) => {
        if (data.statusCode == 0) {
          db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Reminders;", [], (_, res) => {
              var temp = [];
              for (let i = 0; i < res.rows.length; i++) {
                temp.push(res.rows.item(i));
              }
              setDeviceScheduledNotififcations(temp);
              setReminders(data && data.payload ? data.payload : []);
              setLoaded(true);
            });
          });
        }
      })
      .catch((err) => {});
  };

  const syncReminders = () => {
    dispatch(startLoading());
    getReminders({ user_id: userID.toString() })
      .then((data) => {
        if (data.statusCode == 0) {
          dispatch(startLoading());
          deleteUserRemindersListFromDB(userID.toString(), () =>
            addRemindersListToDB(data.payload, () => {
              db.transaction((tx) => {
                tx.executeSql("SELECT * FROM Reminders;", [], (_, res) => {
                  var temp = [];
                  for (let i = 0; i < res.rows.length; i++) {
                    temp.push(res.rows.item(i));
                  }
                  // alert(JSON.stringify(temp));

                  setDeviceScheduledNotififcations(temp);
                  setReminders(data && data.payload ? data.payload : []);
                  setLoaded(true);
                  dispatch(
                    showAlert({
                      msg: i18n.t("reminder.updateSuccess"),
                      type: "success",
                      present: false,
                      iconName: "check",
                    })
                  );
                });
              });
            })
          );
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
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setShowBackDrop(false);
      dispatch(startLoading());
      fetchReminders();
      PushNotification.getChannels(function (channel_ids) {
        console.log("Channels: ", channel_ids);
      });
      PushNotification.getScheduledLocalNotifications((notifications) => {
        console.log("Scheduled Notifications: ", notifications);
        // alert(JSON.stringify(notifications.map(n => { return { "Title": n.message, "Date": new Date(jsCoreDateCreator(moment(n.date).format("YYYY-MM-DD H:mm:ss"))) } })));
        // alert(JSON.stringify(notifications.filter(n => n.message.includes("Gege"))));
        // alert(JSON.stringify(notifications));

        //new Date(jsCoreDateCreator())

        //console.log(new Date());
        //alert(new Date());
        // setDeviceScheduledNotififcations(notifications);
      });
    });
    return unsubscribe;
  }, [navigation]);

  const isExpired = (item) => {
    return new Date(item.end_date) < new Date();
  };

  const isUnSynced = (item) => {
    return !deviceScheduledNotififcations.find(
      (n) => n.ReminderID == item.reminder_id
    );
  };

  const openConfirmDeleteDialogue = () => {
    dispatch(
      showConfirmDialogue({
        msg: i18n.t("records.shareRecords.confirmDelete"),
        title: i18n.t("records.shareRecords.deleteTitle"),
        leftButton: new ButtonAttributes(
          i18n.t("records.shareRecords.delete"),
          deleteItem,
          theme.colors.danger
        ),
      })
    );
  };

  const updateItem = (targetItem) => {
    const item = targetItem.reminder_id ? targetItem : selectedReminder.current;
    navigation.navigate("AddReminder", item);
  };

  const deleteItem = () => {
    const reminderID =
      selectedReminder.current && selectedReminder.current.reminder_id;
    if (reminderID) {
      deleteReminder({ reminder_id: reminderID })
        .then((res) => {
          const reminder = reminders.find((r) => r.reminder_id === reminderID);
          deleteReminderFromDB(reminder, () => scheduleReminders());
          setReminders((prevReminders) =>
            prevReminders.filter((r) => r.reminder_id !== reminderID)
          );
          closeBottomSheet();
          dispatch(
            showAlert({
              msg: i18n.t("reminder.deleteSuccess"),
              type: "success",
              present: false,
              iconName: "check",
            })
          );
        })
        .catch((err) => {});
    }
    selectedReminder.current = null;
  };

  const bottomSheetButtonsList = [
    new ButtonAttributes(
      i18n.t("records.shareRecords.edit"),
      updateItem,
      theme.colors.primary
    ),
    new ButtonAttributes(
      i18n.t("records.shareRecords.delete"),
      openConfirmDeleteDialogue,
      theme.colors.danger
    ),
    new ButtonAttributes(
      i18n.t("records.shareRecords.cancel"),
      closeBottomSheet,
      theme.colors.secondary
    ),
  ];

  const renderItem = ({ item }) => {
    const isExpiredReminder = isExpired(item);
    const isUnSyncedReminder = isUnSynced(item);
    const displayTitle =
      item.reminder_title.indexOf("\n") === -1
        ? item.reminder_title
        : item.reminder_title.substr(0, item.reminder_title.lastIndexOf("\n"));
    return (
      <Swipeable
        renderRightActions={(_, dragX) => {
          const scale = dragX.interpolate({
            inputRange: [-90, -45],
            outputRange: [1, 0],
            extrapolate: "clamp",
          });
          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  selectedReminder.current = item;
                  openConfirmDeleteDialogue();
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.swipeableBox, styles.deleteBox]}>
                  <Animatable.View style={{ transform: [{ scale: scale }] }}>
                    <Icon
                      type="ionicon"
                      name="ios-trash"
                      size={30}
                      color="white"
                      containerStyle={{ padding: 3 }}
                    />
                  </Animatable.View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateItem(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.swipeableBox, styles.updateBox]}>
                  <Animatable.View style={{ transform: [{ scale: scale }] }}>
                    <Icon
                      name="edit"
                      size={30}
                      color="white"
                      containerStyle={{ padding: 3 }}
                    />
                  </Animatable.View>
                </View>
              </TouchableOpacity>
            </>
          );
        }}
      >
        <TouchableWithoutFeedback onPress={() => openBottomSheet(item)}>
          <ListItem
            key={item.reminder_id}
            containerStyle={[
              styles.listItemContainer,
              (isExpiredReminder || isUnSyncedReminder) &&
                styles.expiredItemContainer,
            ]}
            title={displayTitle}
            titleStyle={[
              styles.title,
              (isExpiredReminder || isUnSyncedReminder) &&
                styles.expirationTimeText,
            ]}
            subtitle={
              <>
                <View style={styles.subtitle}>
                  <Text style={[styles.doctorText]}>
                    {moment(item.start_date).format("L")}
                  </Text>
                  <Text style={[styles.doctorText]}>
                    To {moment(item.end_date).format("L")}
                  </Text>
                  <Text style={[styles.doctorText]}>
                    {item.frequency_per_day} times/day
                  </Text>
                </View>
              </>
            }
            subtitleStyle={styles.subtitleText}
          />
          {(isExpiredReminder || isUnSyncedReminder) && (
            <View
              style={[
                styles.expiredContainer,
                isExpiredReminder ? styles.expiredCont : styles.syncCont,
              ]}
            >
              <Text style={styles.expiredText}>
                {isExpiredReminder
                  ? i18n.t("records.shareRecords.expired")
                  : i18n.t("reminder.unsynced")}
              </Text>
            </View>
          )}
        </TouchableWithoutFeedback>
      </Swipeable>
    );
  };

  let addButton = (
    <>
      <ActionButton
        buttonColor={theme.colors.primary}
        autoInactive={true}
        size={52}
        degrees={0}
        hideShadow={false}
        renderIcon={() => <Icon name="md-add" type="ionicon" color="#FFF" />}
        onPress={() => navigation.navigate("AddReminder")}
      />
      {/* <ActionButton
        buttonColor={theme.colors.primary}
        autoInactive={true}
        size={52}
        degrees={0}
        position="center"
        hideShadow={false}
        renderIcon={() => <Icon name="md-close" type="ionicon" color="#FFF" />}
        onPress={() => {
          PushNotification.cancelAllLocalNotifications();
          PushNotification.removeAllDeliveredNotifications();
          PushNotification.getChannels(function (channel_ids) {
            channel_ids.forEach((channelID) => {
              PushNotification.deleteChannel(channelID);
            });
          });
        }}
      /> */}
      <ActionButton
        buttonColor={theme.colors.success}
        autoInactive={true}
        size={52}
        degrees={0}
        position="left"
        hideShadow={false}
        renderIcon={() => <Icon name="md-sync" type="ionicon" color="#FFF" />}
        onPress={syncReminders}
      />
    </>
  );

  if (!loaded || isLoading) return <Loader />;
  else if (!reminders || !reminders.length)
    return (
      <>
        <NoDataScreen noData={true} />
        {addButton}
      </>
    );
  else if (loaded && reminders && reminders.length)
    return (
      <>
        <FlatList
          contentContainerStyle={styles.container}
          data={reminders}
          renderItem={renderItem}
          keyExtractor={(item) => item.reminder_id + ""}
        />
        {addButton}
        <SharedLinksBottomSheet
          BottomSheetButtonsList={bottomSheetButtonsList}
          closeBottomSheet={closeBottomSheet}
          bottomSheet={bottomSheet}
          showBackDrop={showBackDrop}
          setShowBackDrop={setShowBackDrop}
        />
      </>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 30,
  },
  listItemContainer: {
    paddingVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    margin: 6,
  },
  expiredItemContainer: {
    backgroundColor: "#F8F8F8",
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  title: {
    fontSize: 15,
    color: theme.colors.secondary,
    fontFamily: fonts.MontserratBold,
  },
  swipeableBox: {
    justifyContent: "center",
    alignItems: "center",
    width: metrics.vw * 20,
    height: "85%",
    paddingVertical: 14,
    elevation: 5,
    marginVertical: 6,
  },
  deleteBox: {
    backgroundColor: "red",
  },
  updateBox: {
    backgroundColor: theme.colors.primary,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 60,
    backgroundColor: theme.colors.primary,
  },
  text: {
    fontFamily: fonts.MontserratBold,
    fontSize: 20,
  },
  expiredContainer: {
    transform: [{ rotate: "35deg" }],
    position: "absolute",
    top: 20,
    right: 5,
    padding: 5,
    elevation: 10,
  },
  expiredText: {
    color: "#F8F8F8",
  },
  subtitleText: {
    paddingTop: 5,
    fontSize: 13,
  },
  subtitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  doctorText: {
    color: theme.colors.primary,
  },
  expirationTimeText: {
    color: "grey",
  },
  syncCont: {
    backgroundColor: "darkgrey",
    opacity: 0.8,
  },
  expiredCont: {
    backgroundColor: "red",
    opacity: 0.8,
  },
});