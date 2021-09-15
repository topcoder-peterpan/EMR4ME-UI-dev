import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { fonts } from "../../../constants";
import SettingsIcon from "../../../components/common/SettingsIcon";
import Providers from "../../Providers";
import { View } from "react-native";
import ShareIcon from "../../../components/common/ShareIcon";

const ProfileNavigator = createStackNavigator();

export default (props) => {
  return (
    <ProfileNavigator.Navigator>
      <ProfileNavigator.Screen
        name="Providers"
        component={Providers}
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
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <ShareIcon />
              <SettingsIcon />
            </View>
          ),
        }}
      />
    </ProfileNavigator.Navigator>
  );
};
