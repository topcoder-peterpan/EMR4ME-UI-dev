import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";

import Landing from "./auth";
import Login from "./auth/Login";
import ForgotPW from "./auth/ForgotPW";
import CodeConfirm from "./auth/CodeConfirm";
import ResetPW from "./auth/ResetPW";
import SignUp from "./auth/SignUp";
import LegalNotice from "./auth/LegalNotice";
import Terms from "./auth/Terms";
import AppStack from "./app";
import WebView from "../screens/app/profile/webView";
import { fonts } from "../constants";
import BackButton from "../components/common/back-button";
import Settings from "./Settings";
import Profile from "./app/profile/Profile";
import ShareRecords from "./app/records/ShareRecords";
import AddDoctor from "./app/records/Doctors/AddDoctor";
import AddReminder from "./app/reminders/CreateReminder";
import Doctor from "./app/records/Doctors/Doctor";
import SharedLinks from "./app/records/Share/SharedLinks";
import Reminders from "./app/reminders/index";
import LinkViewer from "./app/records/LinkViewer";
import SettingsIcon from "../components/common/SettingsIcon";
import ShareIcon from "../components/common/ShareIcon";
import { useSelector } from "react-redux";
import { Platform } from "react-native";

const Stack = createStackNavigator();
const AuthNavigator = createStackNavigator();

export default (props) => {
  const { userToken, theme, isSignout } = props;
  const selectMode = useSelector((state) => state.sharedRecords.selectMode);

  const recordsStackOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: "#1EB5FC",
      elevation: 0,
    },
    headerTitleStyle: {
      color: "white",
      fontFamily: fonts.MontserratBold,
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

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {userToken == false || isSignout ? (
        <AuthNavigator.Navigator>
          <AuthNavigator.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }}
          />
          <AuthNavigator.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: true,
              headerTitleStyle: {
                color: "#FFF",
                fontFamily: fonts.MontserratBold,
              },
              headerTintColor: "white",
              title: "SIGN IN",
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTitleAlign: "center",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
          <AuthNavigator.Screen
            name="ForgotPW"
            component={ForgotPW}
            options={{
              headerTintColor: "white",
              headerShown: true,
              title: "Reset Password",
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTitleStyle: {
                color: "#FFF",
                fontFamily: fonts.MontserratBold,
              },
              headerTitleAlign: "center",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
          <AuthNavigator.Screen
            name="CodeConfirm"
            component={CodeConfirm}
            options={{
              headerTintColor: "white",
              headerShown: true,
              title: "Reset Password",
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTitleStyle: {
                color: "#FFF",
                fontFamily: fonts.MontserratBold,
              },
              headerTitleAlign: "center",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
          <AuthNavigator.Screen
            name="ResetPW"
            component={ResetPW}
            options={{
              headerTintColor: "white",
              headerShown: true,
              title: "Reset Password",
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTitleStyle: {
                color: "#FFF",
                fontFamily: fonts.MontserratBold,
              },
              headerTitleAlign: "center",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
          <AuthNavigator.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: true,
              headerTitleStyle: {
                color: "#FFF",
                fontFamily: fonts.MontserratBold,
              },
              headerTintColor: "white",
              title: "SIGN UP",
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTitleAlign: "center",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
          <AuthNavigator.Screen
            name="LegalNotice"
            component={LegalNotice}
            options={{
              headerShown: true,
              headerTitleStyle: {
                color: "#FFF",
                fontFamily: fonts.MontserratBold,
              },
              headerTintColor: "white",
              title: "LICENSE",
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTitleAlign: "center",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
          <AuthNavigator.Screen
            name="Terms"
            component={Terms}
            options={{
              headerShown: true,
              headerTitleStyle: {
                color: "#FFF",
                fontFamily: fonts.MontserratBold,
              },
              headerTintColor: "white",
              title: "POLICY",
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTitleAlign: "center",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
        </AuthNavigator.Navigator>
      ) : userToken ? (
        <Stack.Navigator>
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{
              headerShown: false,
              // title: 'LOGIN',
              headerStyle: {
                backgroundColor: "#1EB5FC",
              },
              headerTitleStyle: {
                color: "white",
                fontFamily: fonts.MontserratBold,
                fontSize: 18,
                alignSelf: "center",
              },
              headerTitleAlign: "center",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
          <Stack.Screen
            name="LinkProvider"
            component={WebView}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#1EB5FC",
                elevation: 0,
              },
              headerTitleStyle: {
                color: "white",
                fontFamily: fonts.MontserratBold,
                fontSize: 16,
                alignSelf: "center",
              },
              headerTitleAlign: "center",
              headerTintColor: "white",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#1EB5FC",
                elevation: 0,
              },
              headerTitleStyle: {
                color: "white",
                fontFamily: fonts.MontserratBold,
                fontSize: 16,
                alignSelf: "center",
              },
              headerTitleAlign: "center",
              headerTintColor: "white",
              headerLeft: (props) => <BackButton {...props} />,
            }}
          />

          <Stack.Screen
            name="ShareRecords"
            component={ShareRecords}
            options={{
              ...recordsStackOptions,
              headerLeft: (props) => !selectMode && <BackButton {...props} />,
              title: "My Circle",
              gestureEnabled: !selectMode && Platform.OS === "ios",
            }}
          />

          <Stack.Screen
            name="Doctor"
            component={Doctor}
            options={{
              ...recordsStackOptions,
              title: "My Circle",
            }}
          />

          <Stack.Screen
            name="AddDoctor"
            component={AddDoctor}
            options={{ ...recordsStackOptions, title: "My Circle" }}
          />

          <Stack.Screen
            name="SharedLinks"
            component={SharedLinks}
            options={{ ...recordsStackOptions, title: "Shared Links" }}
          />
          <Stack.Screen
            name="Reminders"
            component={Reminders}
            options={{ ...recordsStackOptions, title: "Reminders" }}
          />
          <Stack.Screen
            name="AddReminder"
            component={AddReminder}
            options={{ ...recordsStackOptions, title: "Add/Update Reminder" }}
          />
          <Stack.Screen
            name="LinkViewer"
            component={LinkViewer}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : null}
    </NavigationContainer>
  );
};
