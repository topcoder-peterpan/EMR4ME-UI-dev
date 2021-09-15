import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Text } from "react-native-elements";
import {
  filterSystDiastData,
  getAllVitalsData,
} from "../../../store/actions/creators/user";
import { i18n } from "../../../util";
import { theme, fonts, metrics } from "./../../../constants";
import { connect } from "react-redux";
import FilterModal from "../../../components/common/filter-modal-date-range";
import NoDataScreen from "../../../components/common/NoData";
import {
  filterByDateRange,
  isOverlapped,
  mapFloat,
  toDate,
} from "../../../util/common";
import PageContainer from "../common/PageContainer";
import Chart from "./common/Chart";
import FilterIcon from "../common/FilterIcon";
import AddIcon from "./common/AddIcon";

const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
  userData: state.user.userData,
  myProviders: state.user.myProviders,
  isSignout: state.user.isSignout,
});

export default connect(mapStateToProps)((props) => {
  // const screenWidth = Dimensions.get('window').width;
  const [response, setResponse] = useState([]);
  const [chartWidth, setChartWidth] = useState(1);
  const [isLinked, setIsLinked] = useState(true);
  const [chartHeight, setChartHeight] = useState(250);
  const [loaded, setLoaded] = useState(false);
  const [filteredResponseSyst, setFilteredResponseSyst] = useState();
  const [filteredResponseDiast, setFilteredResponseDias] = useState();

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
      {
        data: [],
      },
    ],
  });

  const { userData, isLoading, myProviders, isSignout } = props;
  const reqDiastolicData = {
    vitals: ["diastolic"],
    sessionKey: userData.sessionKey,
  };

  const reqSystolicData = {
    vitals: ["systolic"],
    sessionKey: userData.sessionKey,
  };

  const setData = () => {
    if (response && response[0] && response[1]) {
      const filtedSys = filterByDateRange(
        selectedMinDate,
        selectedMaxDate,
        "record_date",
        response[0]
      );
      setFilteredResponseSyst(filtedSys);
      setFilteredResponseDias(
        filterByDateRange(
          selectedMinDate,
          selectedMaxDate,
          "record_date",
          response[1]
        )
      );
      let diastolicArray = mapFloat(filtedSys, "value", 1).reverse();
      let systolicArray = mapFloat(
        filterByDateRange(
          selectedMinDate,
          selectedMaxDate,
          "record_date",
          response[1]
        ),
        "value",
        1
      ).reverse();
      let data = {
        labels: filtedSys
          .map((p) => (p.record_date ? toDate(p.record_date) : ""))
          .reverse(),

        datasets: [
          {
            data: diastolicArray,
            units: response[0].map((i) => i.unit),
          },
          {
            data: systolicArray,
            units: response[1].map((i) => i.unit),
          },
        ],
      };

      if (data.labels.length > 8) {
        setChartWidth(data.labels.length * 61);
      } else {
        setChartWidth(metrics.vw * 100);
      }

      if (data.datasets.length > 5) {
        setChartHeight(data.datasets.length * 50);
      }

      setChartData(data);
    }
  };

  useEffect(() => {
    Promise.all([
      getAllVitalsData(reqDiastolicData),
      getAllVitalsData(reqSystolicData),
    ]).then((resp) => {
      if (resp[0] && resp[1]) {
        setIsLinked(myProviders ? myProviders.length > 0 : true);
        if (resp[0].payload.success && resp[1].payload.success) {
          const filteredData = filterSystDiastData(
            resp[0].payload.payload,
            resp[1].payload.payload
          );
          setResponse([filteredData.syst, filteredData.diast]);
        }
        setLoaded(true);
      }
    });
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  const [selectedMinDate, setSelectedMinDate] = useState();
  const [selectedMaxDate, setSelectedMaxDate] = useState();

  useEffect(() => {
    if (isSignout) setModalVisible(false);
  }, [isSignout]);

  const getResultsData = () => {
    if (response && selectedMinDate && selectedMaxDate) {
      setData();
    }
  };

  useEffect(() => {
    getResultsData();
  }, [selectedMinDate, selectedMaxDate]);

  useEffect(() => {
    if (response) {
      const min =
        response && response[0]
          ? new Date(
              Math.min.apply(
                null,
                response[0].map((bmi) => new Date(bmi.record_date))
              )
            )
          : null;
      const max =
        response && response[0]
          ? new Date(
              Math.max.apply(
                null,
                response[0].map((bmi) => new Date(bmi.record_date))
              )
            )
          : null;
      if (min) {
        max.setHours(9);
        min.setHours(9);
        setMinDate(min);
        setMaxDate(max);
        setSelectedMinDate(min);
        setSelectedMaxDate(max);
      }
    }
  }, [response]);

  let wrapper = null;
  if (!loaded) wrapper = null;
  else if (!isLoading && !isLinked) wrapper = <NoDataScreen notLinked={true} />;
  else if (!isLoading && response && response[0] && !response[0].length)
    wrapper = <NoDataScreen noData={true} />;
  else if (
    !isLoading &&
    response &&
    response[0] &&
    response[1] &&
    filteredResponseSyst &&
    filteredResponseDiast &&
    filteredResponseSyst[0]
  ) {
    wrapper = (
      <ScrollView>
        <View style={styles.scrollViewHeaderContainer}>
          <Text style={styles.scrollViewHeaderText}>
            {i18n.t("health.pressure.pressure")}
          </Text>
          <FilterIcon
            openFilterModal={() => (response ? setModalVisible(true) : null)}
          />
        </View>
        {(chartData && filteredResponseSyst && !filteredResponseSyst.length) ||
        (chartData.datasets && !chartData.datasets[0].data.length) ? (
          <NoDataScreen noData={true} />
        ) : (
          <>
            <Chart
              data={chartData}
              width={chartWidth}
              height={chartHeight}
              decimalPlaces={0}
              formatYLabel={true}
            />
            <View style={styles.contentContainer}>
              {/* <AddIcon>{i18n.t("health.pressure.addBloodPressure")}</AddIcon> */}
              <View style={styles.recordsContainer}>
                <Text style={styles.recordsHeader}>
                  {i18n.t("records.content.records")}
                </Text>
                <View style={styles.recordContainer}>
                  <View>
                    <Text style={styles.recordHeader}>
                      {i18n.t("health.temperature.latestRecord")}
                    </Text>

                    <Text>
                      {response &&
                      filteredResponseDiast &&
                      filteredResponseDiast[0] &&
                      filteredResponseDiast[0].record_date
                        ? toDate(filteredResponseDiast[0].record_date)
                        : null}
                    </Text>
                    <Text style={styles.recordText}>
                      {filteredResponseDiast[0].value}
                      {"/"}
                      {filteredResponseSyst[0].value} {filteredResponseSyst[0].unit}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    );
  } else if (
    !isLoading &&
    (isOverlapped(selectedMinDate, selectedMaxDate) ||
      (filteredResponseSyst && !filteredResponseSyst.length))
  )
    wrapper = (
      <ScrollView>
        <View style={styles.scrollViewHeaderContainer}>
          <Text style={styles.scrollViewHeaderText}>
            {i18n.t("health.pressure.pressure")}
          </Text>
          <FilterIcon
            openFilterModal={() => (response ? setModalVisible(true) : null)}
          />
        </View>
        <NoDataScreen navigation={props.navigation} noData={true} />
      </ScrollView>
    );

  return (
    <PageContainer>
      <FilterModal
        modalVisible={modalVisible}
        headerTitle={i18n.t("common.filter")}
        onClose={() => {
          setModalVisible(false);
        }}
        minDate={minDate}
        maxDate={maxDate}
        selectedMinDate={selectedMinDate}
        selectedMaxDate={selectedMaxDate}
        setSelectedMinDate={setSelectedMinDate}
        setSelectedMaxDate={setSelectedMaxDate}
      />
      {wrapper}
    </PageContainer>
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
  loadingVIewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
    alignItems: "center",
  },
  scrollViewHeaderText: {
    fontSize: 22,
    color: theme.colors.secondary,
    fontFamily: fonts.MontserratBold,
  },
  contentContainer: {
    padding: 20,
  },
  recordsContainer: {
    marginTop: 30,
  },
  recordsHeader: {
    color: theme.colors.secondary,
    fontSize: 17,
    fontFamily: fonts.MontserratBold,
  },
  recordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  recordHeader: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontFamily: fonts.MontserratBold,
  },
  recordText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: fonts.MontserratBold,
    marginTop: 10,
  },
});
