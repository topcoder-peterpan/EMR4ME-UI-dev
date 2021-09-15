import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ThemeConsumer, Text, Avatar, Icon } from "react-native-elements";
import { images, fonts, theme, metrics } from "../../../../constants";
import { connect, useDispatch } from "react-redux";
import { i18n } from "../../../../util";
import moment from "moment";

const Profile = (props) => {
  const doctor = props.route ? props.route.params : {};

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar
            backgroundColor={theme.colors.primary}
            barStyle="light-content"
          />
          <SafeAreaView style={styles.container}>
            <ScrollView
              style={{ flex: 1, backgroundColor: "white" }}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 30,
                  paddingBottom: 10,
                  backgroundColor: "#1EB5FC",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 20,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: metrics.vw * 100,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate("SharedLinks", {
                        ...props.route.params,
                      })
                    }
                    }
                  >
                    <Icon
                      type="font-awesome"
                      name="share"
                      size={28}
                      color={theme.colors.white}
                      containerStyle={{ padding: 3 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("AddDoctor", {
                        ...props.route.params,
                      })
                    }
                  >
                    <Icon
                      type="font-awesome"
                      name="edit"
                      size={28}
                      color={theme.colors.white}
                      containerStyle={{ padding: 3 }}
                    />
                  </TouchableOpacity>
                </View>

                <Avatar
                  source={images.avatar}
                  rounded
                  containerStyle={styles.avatarContainer}
                />
                <Text style={styles.title}>
                  {doctor.fname + " " + doctor.lname}
                </Text>
              </View>
              <View style={{ backgroundColor: "#1EB5FC" }}>
                <View style={styles.body}>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.bodyTitle}>
                      {i18n.t("user.contactInfo")}
                    </Text>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    {doctor.phone
                      ? doctor.phone.split(",").map((phone) => (
                          <View style={styles.row}>
                            <Text>{i18n.t("user.phone")}</Text>

                            <Text style={{ fontFamily: fonts.MontserratBold }}>
                              {phone}
                            </Text>
                          </View>
                        ))
                      : null}

                    {doctor.email
                      ? doctor.email.split(",").map((phone) => (
                          <View style={styles.row}>
                            <Text>{i18n.t("user.mail")}</Text>
                            <Text style={{ fontFamily: fonts.MontserratBold }}>
                              {phone}
                            </Text>
                          </View>
                        ))
                      : null}
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  row: {
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    paddingVertical: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  avatarContainer: {
    borderWidth: 4,
    borderColor: theme.colors.success,
    elevation: 11,
    width: 95,
    height: 95,
    borderRadius: 50,
    overflow: "hidden",
  },
  title: {
    color: "#FFF",
    fontFamily: fonts.MontserratBold,
    fontSize: 22,
    marginTop: 10,
  },
  body: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  bodyTitle: {
    color: theme.colors.secondary,
    fontSize: 17,
    fontFamily: fonts.MontserratBold,
  },
  name: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: fonts.MontserratBold,
    marginTop: 15,
  },
  dob: {
    color: "#3D3D3D",
    fontSize: 14,
    paddingTop: 10,
    fontFamily: "Montserrat-Regular",
  },
});
