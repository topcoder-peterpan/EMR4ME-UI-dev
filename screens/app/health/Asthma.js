import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, Button, Slider, CheckBox } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import { theme, fonts, StaticData } from "./../../../constants";
import { RiskPrediction } from "../../../util/RiskCalculator";
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
  const [percentage, setPercentage] = useState(0);
  const { userData } = props;
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(0);
  const [race, setRace] = useState("");
  const [bmi, setBmi] = useState(0);
  const [oralContraceptives, setOralContraceptives] = useState(false);
  const _scrollView = useRef(null);

  const resetValues = () => {
    setPercentage(0);
    setRace("");
    setGender(null);
    setBmi(0);
    setOralContraceptives(false);
  };

  useEffect(() => {
    const _age =
      parseInt(new Date().getFullYear()) -
      parseInt(new Date(userData.userModel.dob).getFullYear());
    setAge(_age);
  }, []);

  return (
    <PageContainer>
      <ScrollView
        ref={_scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <View style={styles.scrollViewHeaderContainer}>
          <Text style={styles.scrollViewHeaderText}>
            {i18n.t("health.asthma.header")}
          </Text>
        </View>
        <CircularProgress fillPercent={percentage / 7.04}>
          {percentage / 100} times
        </CircularProgress>
        <View style={styles.factorsContainer}>
          <Text style={styles.riskFactorHeader}>
            {i18n.t("health.asthma.riskFactors")}
          </Text>
          <TouchableOpacity onPress={resetValues}>
            <Text style={styles.reset}>{i18n.t("health.asthma.reset")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataContainer}>
          <Dropdown
            onChangeText={(value, index, data) => {
              setRace(value);
            }}
            overlayStyle={{ backgroundColor: "#00000055" }}
            label={i18n.t("health.asthma.race")}
            data={StaticData.raceList}
            itemCount={4.4}
            value={race ? race.value : ""}
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

          <View style={[styles.row, { marginTop: 15 }]}>
            <Text>
              {i18n.t("health.main.bmi")} ({bmi.toFixed(1)})
            </Text>
            <Slider
              style={{ width: 150 }}
              minimumValue={10}
              maximumValue={100}
              value={bmi}
              step={0.1}
              onValueChange={(value) => {
                setBmi(value);
              }}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor={theme.colors.primary}
            />
          </View>

          {gender && gender.key !== "m" && (
            <CheckBox
              title={i18n.t("health.asthma.oralContraceptives")}
              checked={oralContraceptives}
              containerStyle={styles.checkBoxContainer}
              textStyle={styles.checkBoxText}
              onPress={() => {
                setOralContraceptives(oralContraceptives ? false : true);
              }}
            />
          )}

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
                  RiskPrediction.asthmaRS({
                    gender: gender.value.toLowerCase(),
                    age,
                    race,
                    BMI: bmi,
                    oralContraceptives,
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
  loadingViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  scrollViewHeaderContainer: {
    paddingHorizontal: 30,
    marginTop: 30,
  },
  scrollViewHeaderText: {
    color: theme.colors.secondary,
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
  },
  factorsContainer: {
    paddingHorizontal: 30,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  riskFactorHeader: {
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
  dataContainer: {
    paddingHorizontal: 30,
    marginTop: 20,
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
