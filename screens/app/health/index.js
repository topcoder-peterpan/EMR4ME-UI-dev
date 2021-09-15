import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Text, Icon, ListItem, Button } from "react-native-elements";
import { i18n } from "../../../util";
import { images, theme, fonts } from "./../../../constants";
import { ScrollView } from "react-native-gesture-handler";
import PageContainer from "../common/PageContainer";
import { useNavigation } from "@react-navigation/native";
import { connect, useDispatch } from "react-redux";
import { clearSignUp } from "../../../store/actions/creators/auth";
import { getMyProvider } from "../../../store/actions/creators/user";

const mapStateToProps = (state) => ({
  isSignUp: state.user.isSignUp,
});
export default connect(mapStateToProps)((props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLinked, setIsLinked] = useState(false);
  useEffect(() => {
    if (props.isSignUp) {
      dispatch(clearSignUp());
      navigation.navigate("Providers");
    }
  }, [props.isSignUp]);
  useEffect(() => {
    if (!props.isSignUp) dispatch(getMyProvider({}));
  }, []);
  const vitalScreens = [
    {
      name: i18n.t("health.main.temperature"),
      screen: "Temperature",
      description: i18n.t("health.main.temperatureDesciption"),
      icon: (
        <Icon
          type="font-awesome"
          name="thermometer"
          size={42}
          color="#1EB5FC"
          containerStyle={{ width: 50 }}
        />
      ),
    },
    {
      name: i18n.t("health.main.weight"),
      screen: "Weight",
      description: i18n.t("health.main.weightDescription"),
      icon: (
        <Icon
          type="material-community"
          name="weight-pound"
          size={42}
          color="#1EB5FC"
          containerStyle={{ width: 50 }}
        />
      ),
    },
    {
      name: i18n.t("health.main.height"),
      screen: "Height",
      description: i18n.t("health.main.heightDescription"),
      icon: (
        <Icon
          type="entypo"
          name="ruler"
          size={42}
          color="#1EB5FC"
          containerStyle={{ width: 50 }}
        />
      ),
    },
    {
      name: i18n.t("health.main.bmi"),
      screen: "BMI",
      description: i18n.t("health.main.bmiDescription"),
      icon: (
        <Icon
          type="ionicon"
          name="ios-body"
          size={42}
          color="#1EB5FC"
          containerStyle={{ width: 50 }}
        />
      ),
    },
    {
      name: i18n.t("health.main.pulse"),
      screen: "Pulse",
      description: i18n.t("health.main.pulseDescription"),
      icon: (
        <Icon
          type="ionicon"
          name="ios-pulse"
          size={42}
          color="#1EB5FC"
          containerStyle={{ width: 50 }}
        />
      ),
    },
    {
      name: i18n.t("health.main.bloodPressure"),
      screen: "Pressure",
      description: i18n.t("health.main.bloodPressureDescription"),
      icon: (
        <Icon
          type="material-community"
          name="blood-bag"
          size={42}
          color="#1EB5FC"
          containerStyle={{ width: 50 }}
        />
      ),
    },
  ];
  return isLinked ? (
    <View style={styles.noLinkedContainer}>
      <Image source={images.emptyScreen} />
      <Text style={styles.notLinkedText}>
        {i18n.t("health.main.notLinked")}
      </Text>
      <Button
        title={i18n.t("health.main.linkBtn")}
        buttonStyle={styles.notLinkedButton}
        containerStyle={styles.notLinkedButtonContainer}
        onPress={() => {
          props.navigation.navigate("Providers");
        }}
      />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle={"light-content"}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text>{i18n.t("health.main.checkText")}</Text>
        <View style={styles.conditionsContainer}>
          <View style={styles.row}>
            <View style={styles.col}>
              <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.colors.error }]}
                onPress={() => {
                  props.navigation.navigate("Asthma");
                }}
                activeOpacity={0.85}
              >
                <Image source={images.bg} style={styles.btnBg} />
                <Text style={styles.btnTitle}>
                  {i18n.t("health.main.Asthma")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.col}>
              <TouchableOpacity
                style={[
                  styles.card,
                  { backgroundColor: theme.colors.secondary },
                ]}
                onPress={() => {
                  props.navigation.navigate("Stroke");
                }}
                activeOpacity={0.85}
              >
                <Image source={images.bg} style={styles.btnBg} />
                <Text style={styles.btnTitle}>
                  {i18n.t("health.main.stroke")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.col}>
              <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  props.navigation.navigate("Cardiovascular");
                }}
                activeOpacity={0.85}
              >
                <Image source={images.bg} style={styles.btnBg} />
                <Text style={styles.btnTitle}>
                  {i18n.t("health.main.cardiovascular")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.vitalsContainer}>
          <Text style={styles.scrollViewHeader}>
            {i18n.t("health.main.vitalsHeader")}
          </Text>
          <Text>{i18n.t("health.main.vitalText")}</Text>
        </View>

        {vitalScreens.map((vital, i) => (
          <ListItem
            key={i}
            containerStyle={{
              paddingHorizontal: 0,
              paddingBottom: 20,
              borderBottomColor: "#EAEAEA",
              borderBottomWidth: vitalScreens.length === i + 1 ? 0 : 1,
            }}
            onPress={() => {
              props.navigation.navigate(vital.screen);
            }}
            title={vital.name}
            titleStyle={styles.itemTitle}
            subtitle={vital.description}
            subtitleStyle={{ marginLeft: 10 }}
            leftElement={vital.icon}
            chevron={{ size: 30, color: theme.colors.error }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -10,
  },
  col: {
    paddingHorizontal: 10,
    flexGrow: 1,
    marginTop: 20,
  },
  card: {
    minHeight: 150,
    paddingTop: 70,
    paddingLeft: 25,
    paddingBottom: 25,
    borderRadius: 10,
    paddingRight: 25,
  },
  btnBg: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  btnTitle: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: fonts.MontserratBold,
  },
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noLinkedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  notLinkedText: {
    fontSize: 16,
    color: "#474747",
    fontFamily: fonts.MontserratBold,
    textAlign: "center",
    width: "70%",
  },
  notLinkedButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  notLinkedButtonContainer: {
    marginTop: 35,
  },
  scrollViewContainer: {
    padding: 30,
  },
  scrollViewHeader: {
    color: theme.colors.secondary,
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
    // marginTop: 30,
  },
  conditionsContainer: {
    marginVertical: 20,
  },
  vitalsContainer: {
    marginVertical: 30,
  },
  itemTitle: {
    color: theme.colors.secondary,
    fontSize: 20,
    fontFamily: fonts.MontserratBold,
    marginLeft: 10,
  },
});
