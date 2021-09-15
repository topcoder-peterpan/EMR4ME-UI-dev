import * as React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
  NativeModules,
  View,
} from "react-native";
import { ThemeConsumer, Text, Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../components/auth/AuthContext";
import { fonts, metrics, theme } from "../constants";
import { actionLogger } from "../store/actions/creators/auth";
import { i18n } from "../util";

export default ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  const handleContactusPress = () => {
    Alert.alert(
      i18n.t("user.contactUs"),
      i18n.t("user.contactUsMsg"),
      [
        {
          text: i18n.t("common.cancel"),
          style: "cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Send an email",
          onPress: () => {
            Linking.openURL("mailto:help@fiithealth.com");
          }, //adding try catch here
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveDataPress = () => {
    Alert.alert(
      i18n.t("user.removeData"),
      i18n.t("user.removeDataMsg"),
      [
        {
          text: i18n.t("common.cancel"),
          style: "cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Send an email",
          onPress: () => {
            Linking.openURL("mailto:help@fiithealth.com");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar
            backgroundColor={theme.colors.primary}
            barStyle="light-content"
          />
          <SafeAreaView style={styles.container}>
            <ScrollView>
              <TouchableOpacity
                style={styles.row}
                onPress={() => navigation.navigate("Profile")}
              >
                <View style={styles.icon}>
                  <Icon
                    type="ionicon"
                    name="md-person"
                    color={theme.colors.primary}
                    size={32}
                  />
                </View>
                <Text style={styles.title}>{i18n.t("user.profile")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.row}
                onPress={() => navigation.navigate("ShareRecords")}
              >
                <View style={styles.icon}>
                  <Icon
                    type="material-community"
                    name="doctor"
                    color={theme.colors.primary}
                    size={32}
                  />
                </View>
                <Text style={styles.title}>{i18n.t("user.doctors")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.row}
                onPress={() => navigation.push("SharedLinks")}
              >
                <View style={styles.icon}>
                  <Icon
                    type="ionicon"
                    name="ios-key"
                    color={theme.colors.primary}
                    size={32}
                  />
                </View>
                <Text style={styles.title}>{i18n.t("user.sharedLinks")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.row}
                onPress={() => navigation.push("Reminders")}
              >
                <View style={styles.icon}>
                  <Icon
                    type="ionicon"
                    name="ios-time"
                    color={theme.colors.primary}
                    size={32}
                  />
                </View>
                <Text style={styles.title}>{i18n.t("user.reminders")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.row}
                onPress={() => handleContactusPress()}
              >
                <View style={styles.icon}>
                  <Icon
                    type="ionicon"
                    name="md-help"
                    color={theme.colors.primary}
                    size={32}
                  />
                </View>
                <Text style={styles.title}>{i18n.t("common.help")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.row}
                onPress={() => handleRemoveDataPress()}
              >
                <View style={styles.icon}>
                  <Icon
                    type="ionicon"
                    name="md-trash"
                    color={theme.colors.primary}
                    size={32}
                  />
                </View>
                <Text style={styles.title}>{i18n.t("user.removeData")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  actionLogger(false, "Sign Out", "");
                  signOut();
                }}
              >
                <View style={styles.icon}>
                  <Icon
                    type="font-awesome"
                    name="sign-out"
                    color={theme.colors.primary}
                    size={32}
                  />
                </View>
                <Text style={styles.title}>{i18n.t("user.logout")}</Text>
              </TouchableOpacity>
            </ScrollView>
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
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 30,
  },
  title: {
    paddingLeft: 20,
    color: theme.colors.secondary,
    fontFamily: fonts.MontserratBold,
    fontSize: 18,
    width: 90 * metrics.vw,
  },
  icon: {
    width: 10 * metrics.vw,
  },
});
