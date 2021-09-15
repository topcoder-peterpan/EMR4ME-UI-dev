import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, Button, Slider, CheckBox } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import { RiskPrediction } from "../../../util/RiskCalculator";
import { theme, fonts, StaticData } from "./../../../constants";
import { i18n } from "../../../util";
import { connect, useDispatch } from "react-redux";
import { showAlert } from "../../../store/actions/creators/UI";
import PageContainer from "../common/PageContainer";
import CircularProgress from "./common/CircularProgress";

const mapStateToProps = (state) => ({
  userData: state.user.userData,
});

export default connect(mapStateToProps)((props) => {
  const dispatch = useDispatch();
  const [percentage, setPercentage] = useState("<00%");
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(0);
  const [education, setEducation] = useState("");
  const [renalDisease, setRenalDisease] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [congestiveHeartFailure, setCongestiveHeartFailure] = useState(false);
  const [peripheralArterialDisease, setPeripheralArterialDisease] = useState(
    false
  );
  const [highBloodPressure, setHighBloodPressure] = useState(false);
  const [ischemicHeartDisease, setIschemicHeartDisease] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [formerSmoker, setFormerSmoker] = useState(false);
  const [alcoholicDrinks, setAlcoholicDrinks] = useState(0);
  const [formerDrinker, setFormerDrinker] = useState(false);
  const [physicalActivity, setPhysicalActivity] = useState(0);
  const [indicatorsOfAnger, setIndicatorsOfAnger] = useState(false);
  const [depression, setDepression] = useState(false);
  const [anxiety, setAnxiety] = useState(false);
  const _scrollView = useRef(null);
  const { userData } = props;

  const resetValues = () => {
    setPercentage("<00%");
    setEducation("");
    setRenalDisease(false);
    setDiabetes(false);
    setCongestiveHeartFailure(false);
    setPeripheralArterialDisease(false);
    setHighBloodPressure(false);
    setIschemicHeartDisease(false);
    setSmoking(false);
    setFormerSmoker(false);
    setAlcoholicDrinks(0);
    setFormerDrinker(false);
    setPhysicalActivity(0);
    setIndicatorsOfAnger(false);
    setDepression(false);
    setAnxiety(false);
    setGender(null);
    setAge(0);
  };

  useEffect(() => {
    const _age = userData.userModel.dob
      ? parseInt(new Date().getFullYear()) -
      parseInt(new Date(userData.userModel.dob).getFullYear())
      : 0;
    setAge(_age);
  }, []);

  return (
    <PageContainer>
      <ScrollView
        ref={_scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {i18n.t("health.stroke.strokeRiskPredictor")}
          </Text>
        </View>
        <CircularProgress fillPercent={percentage.substring(1, percentage.length - 1)}>
          {percentage}
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
              setEducation(value);
            }}
            overlayStyle={{ backgroundColor: "#00000055" }}
            label={i18n.t("health.stroke.edu")}
            data={StaticData.educationList}
            itemCount={4.4}
            value={education ? education.value : ""}
          />

          <Dropdown
            onChangeText={(value, index, data) => {
              setGender(data[index]);
            }}
            overlayStyle={{ backgroundColor: "#00000055" }}
            label={i18n.t("health.asthma.gender")}
            data={StaticData.gender}
            value={gender ? gender.value : ""}
          />

          <CheckBox
            title={i18n.t("health.stroke.renalDisease")}
            checked={renalDisease}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setRenalDisease(renalDisease ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.diabetes")}
            checked={diabetes}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setDiabetes(diabetes ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.congestiveHeartFailure")}
            checked={congestiveHeartFailure}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setCongestiveHeartFailure(congestiveHeartFailure ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.peripheralArterialDisease")}
            checked={peripheralArterialDisease}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setPeripheralArterialDisease(
                peripheralArterialDisease ? false : true
              );
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.highBloodPressure")}
            checked={highBloodPressure}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setHighBloodPressure(highBloodPressure ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.ischemicHeartDisease")}
            checked={ischemicHeartDisease}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setIschemicHeartDisease(ischemicHeartDisease ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.smoking")}
            checked={smoking}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setSmoking(smoking ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.formerSmoker")}
            checked={formerSmoker}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setFormerSmoker(formerSmoker ? false : true);
            }}
          />

          <View style={[styles.row, styles.sliderContainer]}>
            <View>
              <Text>
                {i18n.t("health.stroke.alcoholicDrinks")} (
                {alcoholicDrinks.toFixed(1)})
              </Text>
              <Text>({i18n.t("health.stroke.perWeek")})</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={30}
              value={alcoholicDrinks}
              step={0.5}
              onValueChange={(value) => {
                setAlcoholicDrinks(value);
              }}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor={theme.colors.primary}
            />
          </View>

          <CheckBox
            title={i18n.t("health.stroke.formerDrinker")}
            checked={formerDrinker}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setFormerDrinker(formerDrinker ? false : true);
            }}
          />

          <View style={[styles.row, styles.sliderContainer]}>
            <View>
              <Text>
                {i18n.t("health.stroke.physicalActivity")} (
                {physicalActivity.toFixed(1)})
              </Text>
              <Text>({i18n.t("health.stroke.perWeek")})</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={30}
              value={physicalActivity}
              step={1}
              onValueChange={(value) => {
                setPhysicalActivity(value);
              }}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor={theme.colors.primary}
            />
          </View>

          <CheckBox
            title={i18n.t("health.stroke.indicatorsOfAnger")}
            checked={indicatorsOfAnger}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setIndicatorsOfAnger(indicatorsOfAnger ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.depression")}
            checked={depression}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setDepression(depression ? false : true);
            }}
          />

          <CheckBox
            title={i18n.t("health.stroke.anxiety")}
            checked={anxiety}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            onPress={() => {
              setAnxiety(anxiety ? false : true);
            }}
          />

          <Button
            title="Calculate Risk"
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
                  RiskPrediction.strokeRS({
                    gender: gender.value.toLowerCase(),
                    age,
                    education,
                    renalDisease,
                    diabetes,
                    congestiveHeartFailure,
                    peripheralArterialDisease,
                    highBloodPressure,
                    ischemicHeartDisease,
                    smoking,
                    formerSmoker,
                    alcoholicDrinks,
                    formerDrinker,
                    physicalActivity,
                    indicatorsOfAnger,
                    depression,
                    anxiety,
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
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  checkboxContainer: {
    flex: 1,
    marginLeft: 0,
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  checkboxText: {
    marginLeft: 10,
    fontFamily: fonts.MontserratBold,
    fontWeight: "normal",
  },
  loadingViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
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
    marginTop: 15,
  },
  slider: {
    width: 150,
  },
  btnContainer: {
    marginTop: 20,
  },
  btn: {
    backgroundColor: theme.colors.primary,
  },
});
