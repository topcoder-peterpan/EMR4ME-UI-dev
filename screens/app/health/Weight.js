import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Text } from "react-native-elements";
import { getAllVitalsData } from "../../../store/actions/creators/user";
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
import Statistics from "./common/Statistics";
import FilterIcon from "../common/FilterIcon";
import AddIcon from "./common/AddIcon";

const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
  userData: state.user.userData,
  myProviders: state.user.myProviders,
  isSignout: state.user.isSignout,
});

export default connect(mapStateToProps)((props) => {
  const [chartWidth, setChartWidth] = useState(1);
  const [chartHeight, setChartHeight] = useState(250);
  const [response, setResponse] = useState();
  const [isLinked, setIsLinked] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const { userData, isLoading, myProviders, isSignout } = props;

  useEffect(() => {
    if (isSignout) setModalVisible(false);
  }, [isSignout]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  const reqData = {
    vitals: ["weight"],
    sessionKey: userData.sessionKey,
  };

  useEffect(() => {
    getAllVitalsData(reqData).then((resp) => {
      setIsLinked(myProviders ? myProviders.length > 0 : true);
      setLoaded(true);
      if (resp.payload.success) {
        setResponse(resp.payload.payload);
        if (resp.payload.payload[0] && !!resp.payload.payload.length) {
          setChartData({
            labels: resp.payload.payload
              .map((weight) => toDate(weight.record_date))
              .reverse(),
            datasets: [
              {
                data: mapFloat(resp.payload.payload, "value").reverse(),
              },
            ],
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (chartData.labels.length > 8) {
      setChartWidth(chartData.labels.length * 60);
    } else if (chartData.labels.length > 0) setChartWidth(metrics.vw * 100);

    if (chartData.datasets.length > 5) {
      setChartHeight(chartData.datasets.length * 50);
    }
  }, [chartData]);

  const [modalVisible, setModalVisible] = useState(false);
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  const [selectedMinDate, setSelectedMinDate] = useState();
  const [selectedMaxDate, setSelectedMaxDate] = useState();
  const [filteredResponse, setFilteredResponse] = useState(response);

  const getResultsData = () => {
    if (response && selectedMinDate && selectedMaxDate) {
      const filteredData = filterByDateRange(
        selectedMinDate,
        selectedMaxDate,
        "record_date",
        response
      );
      setFilteredResponse(filteredData);
      setChartData({
        labels: filteredData.map((bmi) => toDate(bmi.record_date)).reverse(),
        datasets: [
          {
            data: mapFloat(filteredData, "value").reverse(),
            units: filteredData.map((i) => (i.unit ? i.unit : "")),
          },
        ],
      });
    }
  };
  useEffect(() => {
    getResultsData();
  }, [selectedMinDate, selectedMaxDate]);
  useEffect(() => {
    if (response) {
      const min = new Date(
        Math.min.apply(
          null,
          response.map((bmi) => new Date(bmi.record_date))
        )
      );
      const max = new Date(
        Math.max.apply(
          null,
          response.map((bmi) => new Date(bmi.record_date))
        )
      );
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
  else if (!isLoading && response && !response.length)
    wrapper = <NoDataScreen noData={true} />;
  else if (
    !isLoading &&
    response &&
    response[0] &&
    filteredResponse &&
    filteredResponse[0]
  )
    wrapper = (
      <ScrollView>
        <View style={styles.scrollViewContainer}>
          <Text style={styles.scrollViewHeader}>
            {i18n.t("health.weight.weight")}
          </Text>
          <FilterIcon
            openFilterModal={() => (response ? setModalVisible(true) : null)}
          />
        </View>
        {(chartData && filteredResponse && !filteredResponse.length) ||
        (chartData.datasets && !chartData.datasets[0].data.length) ? (
          <NoDataScreen noData={true} />
        ) : (
          <>
            <Chart data={chartData} width={chartWidth} height={chartHeight} />
            <View style={styles.contentContainer}>
              {/* <AddIcon>{i18n.t("health.weight.addWeight")}</AddIcon> */}
              <Statistics data={filteredResponse} />
            </View>
          </>
        )}
      </ScrollView>
    );
  else if (
    isOverlapped(selectedMinDate, selectedMaxDate) ||
    (filteredResponse && !filteredResponse.length)
  )
    wrapper = (
      <ScrollView>
        <View style={styles.scrollViewContainer}>
          <Text style={styles.scrollViewHeader}>
            {i18n.t("health.weight.weight")}
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
  loadingViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
    alignItems: "center",
  },
  scrollViewHeader: {
    fontSize: 22,
    color: theme.colors.secondary,
    fontFamily: fonts.MontserratBold,
  },
  filterContainer: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontFamily: fonts.MontserratBold,
    marginHorizontal: 5,
  },
  contentContainer: {
    padding: 20,
  },
});
