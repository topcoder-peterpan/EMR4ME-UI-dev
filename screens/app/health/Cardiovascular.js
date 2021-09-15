import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, Button, Slider, CheckBox } from "react-native-elements";
import { RiskPrediction } from "../../../util/RiskCalculator";
import { Dropdown } from "react-native-material-dropdown";
import { i18n } from "../../../util";
import { theme, fonts, StaticData } from "./../../../constants";
import { connect, useDispatch } from "react-redux";
import { showAlert } from "../../../store/actions/creators/UI";
import PageContainer from "../common/PageContainer";
import CircularProgress from "./common/CircularProgress";

const mapStateToProps = (state) => ({
  userData: state.user.userData,
});

export default connect(mapStateToProps)((props) => {
  const dispatch = useDispatch();
  const [percentage, setPercentage] = useState(0);
  const [hdl, setHdl] = useState(1.0);
  const [cholesterol, setCholesterol] = useState(4.0);
  const [bloodPressure, setBloodPressure] = useState(120);
  const [bloodPressureTreated, setBloodPressureTreated] = useState(true);
  const [smoker, setSmoker] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState();
  const { userData } = props;

  const _scrollView = useRef(null);

  useEffect(() => {
    const _age =
      parseInt(new Date().getFullYear()) -
      parseInt(new Date(userData.userModel.dob).getFullYear());
    setAge(_age);
  }, []);

  const resetValues = () => {
    setPercentage(0);
    setHdl(1.0);
    setCholesterol(4.0);
    setBloodPressure(120);
    setBloodPressureTreated(true);
    setSmoker(false);
    setDiabetes(false);
    setGender(null);
  };
  return (
    <PageContainer>
      <ScrollView
        ref={_scrollView}
        contentContainerStyle={styles.scrollViewConrainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {i18n.t("health.cardio.header")}
          </Text>
        </View>
        <CircularProgress fillPercent={percentage}>
          {percentage} %
        </CircularProgress>
        <View style={[styles.headerContainer, styles.factorsHeaderContainer]}>
          <Text style={styles.factorsHeaderText}>
            {i18n.t("health.asthma.riskFactors")}
          </Text>
          <TouchableOpacity onPress={resetValues}>
            <Text style={styles.reset}>{i18n.t("health.asthma.reset")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContainer}>
          <Dropdown
            onChangeText={(value, index, data) => {
              setGender(data[index]);
            }}
            overlayStyle={{ backgroundColor: "#00000055" }}
            label={i18n.t("health.asthma.gender")}
            data={StaticData.gender}
            value={gender ? gender.value : ""}
          />

          <View style={styles.row}>
            <Text>
              {i18n.t("health.cardio.hdlc")} ({hdl.toFixed(1)})
            </Text>
            <Slider
              style={styles.sliderContainer}
              minimumValue={0.5}
              maximumValue={2}
              value={hdl}
              step={0.1}
              onValueChange={(value) => {
                setHdl(value);
              }}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor={theme.colors.primary}
            />
          </View>
          <View style={styles.row}>
            <Text>
              {i18n.t("health.cardio.cholesterol")} ({cholesterol.toFixed(1)})
            </Text>
            <Slider
              style={styles.sliderContainer}
              minimumValue={0}
              maximumValue={10}
              value={cholesterol}
              step={0.1}
              onValueChange={(value) => {
                setCholesterol(value);
              }}
              minimumTrackTintColor={theme.colors.secondary}
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor={theme.colors.secondary}
            />
          </View>
          <View style={styles.row}>
            <Text>
              {i18n.t("health.main.bloodPressure")} ({bloodPressure.toFixed(1)})
            </Text>
            <Slider
              style={styles.sliderContainer}
              minimumValue={50}
              maximumValue={200}
              value={bloodPressure}
              step={10}
              onValueChange={(value) => {
                setBloodPressure(value);
              }}
              minimumTrackTintColor={theme.colors.error}
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor={theme.colors.error}
            />
          </View>
          <CheckBox
            title={i18n.t("health.cardio.bloodPressureTreated")}
            checked={bloodPressureTreated}
            containerStyle={styles.checkBoxContainer}
            textStyle={styles.checkBoxText}
            onPress={() => {
              setBloodPressureTreated(bloodPressureTreated ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.cardio.smoker")}
            checked={smoker}
            containerStyle={styles.checkBoxContainer}
            textStyle={styles.checkBoxText}
            onPress={() => {
              setSmoker(smoker ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.cardio.haveDiabetes")}
            checked={diabetes}
            containerStyle={styles.checkBoxContainer}
            textStyle={styles.checkBoxText}
            onPress={() => {
              setDiabetes(diabetes ? false : true);
            }}
          />
          <Button
            title={i18n.t("health.asthma.calculateRisk")}
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            onPress={() => {
              if (!gender)
                dispatch(
                  showAlert({
                    msg: i18n.t("health.pleaseSelectGender"),
                    type: "error",
                    present: false,
                    iconName: "warning",
                  })
                );
              else
                setPercentage(
                  RiskPrediction.FRS({
                    gender: gender.value.toLowerCase(),
                    age,
                    hdl,
                    cholesterol,
                    bloodPressure,
                    bloodPressureTreated,
                    smoker,
                    diabetes,
                  }).percentage
                );
              _scrollView.current.scrollTo({ x: 0, y: 0, animated: true });
            }}
          />
        </View>
      </ScrollView>
    </PageContainer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  progressInsideText: {
    color: "#FFF",
    fontFamily: fonts.MontserratBold,
    fontSize: 22,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewConrainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  headerContainer: {
    paddingHorizontal: 30,
    marginTop: 30,
  },
  headerText: {
    color: theme.colors.secondary,
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
  },
  factorsHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  factorsHeaderText: {
    color: theme.colors.secondary,
    fontSize: 20,
    fontFamily: fonts.MontserratBold,
  },
  reset: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.MontserratBold,
    color: theme.colors.primary,
  },
  sliderContainer: {
    width: 150,
  },
  checkBoxContainer: {
    flex: 1,
    marginLeft: 0,
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  checkBoxText: {
    marginLeft: 10,
    fontFamily: fonts.MontserratBold,
    fontWeight: "normal",
  },
  btnContainer: {
    marginTop: 20,
  },
  btn: {
    backgroundColor: theme.colors.primary,
  },
});
