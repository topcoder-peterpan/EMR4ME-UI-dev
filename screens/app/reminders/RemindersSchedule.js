import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import {
  removeDeliveredReminders,
  selectRemindersToSchedule,
} from "./DataAccessLayer";

const IOS_MAX_REMINDERS = 60;
const ANDROID_MAX_REMINDERS = 450;

const isAndroid = () => Platform.OS === "android";

const MAX_REMINDERS_TO_SCHEDULE = isAndroid()
  ? ANDROID_MAX_REMINDERS
  : IOS_MAX_REMINDERS;

export const jsCoreDateCreator = (dateString) => {
  // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"  
  let dateParam = dateString.split(/[\s-:]/)
  dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()
  return new Date(...dateParam)
}

export const scheduleNotification = (user_ID, remID, msg, date) => {
  createChannelIfNotExists(user_ID);

  PushNotification.localNotificationSchedule({
    channelId: user_ID.toString(),
    title: "iFiit Reminder",
    message: msg,
    date: new Date(jsCoreDateCreator(date)),
    userInfo: { id: remID, userID: user_ID },
    allowWhileIdle: true,
  });
};

const createChannelIfNotExists = (userID) => {
  PushNotification.channelExists(userID.toString(), function (exists) {
    if (!exists) {
      PushNotification.createChannel(
        {
          channelId: userID.toString(),
          channelName: "iFiit Reminders Channel",
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );
    }
  });
};

export const scheduleReminders = (callback) => {
  PushNotification.cancelAllLocalNotifications();
  removeDeliveredReminders();
  selectRemindersToSchedule(MAX_REMINDERS_TO_SCHEDULE, callback);
};