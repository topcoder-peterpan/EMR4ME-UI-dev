import React, { useEffect, useState } from "react";
import { Platform, AppState } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, Text } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsIcon from "../../components/common/SettingsIcon";

import { View } from "react-native-animatable";

import Reminders from "./reminders";
import CreateReminder from "./reminders/CreateReminder";

import Records from "./records";

import Health from "./health";
import Cardiovascular from "./health/Cardiovascular";
import Asthma from "./health/Asthma";
import Stroke from "./health/Stroke";
import Temperature from "./health/Temperature";
import Weight from "./health/Weight";
import Height from "./health/Height";
import BMI from "./health/BMI";
import Pulse from "./health/Pulse";
import Pressure from "./health/Pressure";

import VisitsList from "./records/VisitsList";
import ClinicalNotes from "./document";
import DocViewer from "./document/DocViewer";

import ProfileStack from "./profile";
import BackButton from "../../components/common/back-button";
import { Settings } from "react-native";
import ShareIcon from "../../components/common/ShareIcon";
import { useSelector } from "react-redux";
import { fonts, theme } from "../../constants";
import PushNotification from "react-native-push-notification";
import { useNavigation } from "@react-navigation/native";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { setReminderNavigated } from "../../store/actions/creators/user";

const Tab = createBottomTabNavigator();
const RemindersNavigator = createStackNavigator();
const HealthNavigator = createStackNavigator();
const DocumentsNavigator = createStackNavigator();

const remindersStackOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: "#1EB5FC",
    elevation: 0,
  },
  headerTitleStyle: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    alignSelf: "center",
  },
  headerTitleAlign: "center",
  headerTintColor: "white",
  headerRight: () => (
    <View style={{ flexDirection: "row" }}>
      <ShareIcon />
      <SettingsIcon />
    </View>
  ),
};

const RemindersStack = () => {
  return (
    <RemindersNavigator.Navigator>
      <RemindersNavigator.Screen
        name="MEDICATION"
        component={Reminders}
        options={remindersStackOptions}
      />
      <RemindersNavigator.Screen
        name="CreateReminder"
        component={CreateReminder}
        options={{
          ...remindersStackOptions,
          title: "ADD MEDICINE",
          headerLeft: (props) => <BackButton {...props} />,
        }}
      />
    </RemindersNavigator.Navigator>
  );
};

const options = {
  headerShown: true,
  headerStyle: {
    backgroundColor: "#1EB5FC",
    elevation: 0,
  },
  headerTitleStyle: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    alignSelf: "center",
  },
  headerTitleAlign: "center",
  headerTintColor: "white",
  headerLeft: (props) => <BackButton {...props} />,
  headerRight: () => (
    <View style={{ flexDirection: "row" }}>
      <ShareIcon />
      <SettingsIcon />
    </View>
  ),
};

const HealthStack = () => {
  return (
    <HealthNavigator.Navigator>
      <HealthNavigator.Screen
        name="Health Check"
        component={Health}
        options={{ ...options, headerLeft: null }}
      />
      <HealthNavigator.Screen
        name="Cardiovascular"
        component={Cardiovascular}
        options={options}
      />
      <HealthNavigator.Screen
        name="Asthma"
        component={Asthma}
        options={options}
      />
      <HealthNavigator.Screen
        name="Stroke"
        component={Stroke}
        options={options}
      />
      <HealthNavigator.Screen
        name="Temperature"
        component={Temperature}
        options={options}
      />
      <HealthNavigator.Screen
        name="Weight"
        component={Weight}
        options={options}
      />
      <HealthNavigator.Screen
        name="Height"
        component={Height}
        options={options}
      />
      <HealthNavigator.Screen name="BMI" component={BMI} options={options} />
      <HealthNavigator.Screen
        name="Pulse"
        component={Pulse}
        options={options}
      />
      <HealthNavigator.Screen
        name="Pressure"
        component={Pressure}
        options={options}
      />
    </HealthNavigator.Navigator>
  );
};

const DocumentsStack = () => {
  return (
    <DocumentsNavigator.Navigator>
      <DocumentsNavigator.Screen
        name="DocumentVisits"
        component={VisitsList}
        options={{ ...options, headerLeft: null, title: "Visits" }}
      />

      <DocumentsNavigator.Screen
        name="Documents"
        component={ClinicalNotes}
        options={{
          ...options,
          headerLeft: null,
          headerLeft: (props) => <BackButton {...props} />,
        }}
      />
      {/* <DocumentsNavigator.Screen name="Documents" component={DocumentsList} options={{headerShown: false}} /> */}

      <DocumentsNavigator.Screen
        name="DocViewer"
        component={DocViewer}
        options={{ headerShown: false }}
      />
    </DocumentsNavigator.Navigator>
  );
};

export default (props) => {
  const selectMode = useSelector((state) => state.sharedRecords.selectMode);
  const user = useSelector(
    (state) =>
      (state.user && state.user.userData && state.user.userData.userModel) ||
      null
  );

  const userID = user && user.user_id;
  const reminderNavigated = useSelector(
    (state) => state.user.reminderNavigated
  );

  const navigation = useNavigation();

  const checkNavigation = (notification) => {
    if (AppState.currentState === "active") {
      if (notification.data.userID == userID) {
        navigation.navigate("Reminders");
      }
    }
    else
      setTimeout(() => {
        checkNavigation(notification);
      }, 100);
  };

  const onRemoteNotification = (notification) => {
    if (notification.userInteraction) {
      if (notification.foreground) {
        if (notification.data.userID == userID) {
          navigation.navigate("Reminders");
        }
      }
      else {
        checkNavigation(notification);
      }
    }
  };

  const onBackgroundNotification = (data) => {
    if (
      data &&
      // !data._remoteNotificationCompleteCallbackCalled &&
      !reminderNavigated
    ) {
      if (data._data.userID == userID) {
        setReminderNavigated(true);
        navigation.navigate("Reminders");
      }
    }
  };

  useEffect(() => {
    PushNotification.popInitialNotification((notification) => {
      onBackgroundNotification(notification);
    });

    if (Platform.OS == "ios") {
      PushNotificationIOS.addEventListener(
        "notification",
        onRemoteNotification
      );
      PushNotificationIOS.getInitialNotification().then((payload) => {
        onBackgroundNotification(payload);
      });
      return () =>
        PushNotificationIOS.removeEventListener(
          "notification",
          onRemoteNotification
        );
    }
  }, []);

  PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
    onNotification: onRemoteNotification,
    // (required) Called when a remote is received or opened, or local notification is opened

    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);

      // process the action
    },

    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: Platform.OS === "ios",
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Providers") {
            iconName = "h-square";
          } else if (route.name === "Reminders") {
            iconName = "medkit";
          } else if (route.name === "Records") {
            iconName = "file-text-o";
          } else if (route.name === "Health") {
            iconName = "heartbeat";
          } else if (route.name === "Documents") {
            iconName = "files-o";
          }

          // You can return any component that you like here!
          return (
            <View animation="fadeInUp" duration={500} useNativeDriver={true}>
              <Icon
                name={iconName}
                type="font-awesome"
                size={24}
                color={color}
              />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => {
          let name;
          if (route.name === "Providers") {
            name = "Providers";
          } else if (route.name === "Reminders") {
            name = "Reminders";
          } else if (route.name === "Records") {
            name = "Records";
          } else if (route.name === "Health") {
            name = "Health";
          } else if (route.name === "Documents") {
            name = "Visits";
          }
          return (
            <Text
              style={{
                color: focused ? theme.colors.error : theme.colors.primary,
                fontFamily: fonts.MontserratBold,
                fontWeight: "normal",
                fontSize: 12,
              }}
            >
              {name}
            </Text>
          );
        },
      })}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: "#FF4A31",
        headerShown: false,
        inactiveTintColor: "#A4E1FD",
        style: {
          borderTopWidth: 1,
          borderTopColor: "#EEE",
          height: Platform.OS === "android" ? 60 : 90,
          paddingBottom: Platform.OS === "android" ? 0 : 30,
          paddingTop: 2,
        },
      }}
    >
      <Tab.Screen name="Health" component={HealthStack} />
      <Tab.Screen name="Providers" component={ProfileStack} />
      {/* <Tab.Screen name="Reminders" component={RemindersStack} /> */}
      <Tab.Screen
        name="Records"
        component={Records}
        options={{ tabBarVisible: !selectMode }}
      />
      <Tab.Screen name="Documents" component={DocumentsStack} />
    </Tab.Navigator>
  );
};
