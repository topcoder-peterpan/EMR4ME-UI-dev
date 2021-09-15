import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Text, Icon } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";
import { AuthContext } from "../../../components/auth/AuthContext";
import emptyScreen from "../../../assets/images/empty-screen.png";
import PageContainer from "../common/PageContainer";
import FilterIcon from "../common/FilterIcon";

const monthShortNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default (props) => {
  const screenWidth = Dimensions.get("window").width;

  const [response, setResponse] = React.useState();
  const [chartData, setChartData] = React.useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  const { createRequest } = React.useContext(AuthContext);

  const getData = new Promise((resolve, reject) => {
    createRequest(
      "POST",
      "users/get-vitals",
      {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      JSON.stringify({
        vitals: ["respiration"],
      })
    )
      .then((response) => response.json())
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  React.useEffect(() => {
    getData.then((resp) => {
      if (resp.success) {
        setResponse(resp.payload[0]);
        if (resp.payload[0] && !!resp.payload[0].length) {
          setChartData({
            labels: resp.payload[0]
              .map((temp) => new Date(temp.date).toUTCString().substring(4, 16))
              .reverse(),
            datasets: [
              {
                data: resp.payload[0]
                  .map((temp) =>
                    parseInt(temp.value.replace(/[\[\]&]+/g, "").trim())
                  )
                  .reverse(),
              },
            ],
          });
        }
      }
    });
  }, []);

  return !chartData.datasets[0].data.length ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
      }}
    >
      <Image source={emptyScreen} />
      <Text
        style={{
          fontSize: 16,
          color: "#474747",
          fontFamily: "Montserrat-Bold",
          textAlign: "center",
          width: "70%",
        }}
      >
        No data was found
      </Text>
    </View>
  ) : (
    <PageContainer>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 30,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              color: theme.colors.secondary,
              fontFamily: "Montserrat-Bold",
            }}
          >
            Temperature
          </Text>
          <FilterIcon />
        </View>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets,
          }}
          width={Dimensions.get("window").width} // from react-native
          height={250}
          // yAxisLabel="$"
          yAxisSuffix="F"
          verticalLabelRotation={-60}
          chartConfig={{
            backgroundColor: "#064862",
            backgroundGradientFrom: "#12516A",
            backgroundGradientTo: "#064862",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: {
              r: "2",
              strokeWidth: "1",
              stroke: "#CAF369",
            },
          }}
          bezier
          style={{
            marginVertical: 10,
          }}
        />

        <View style={{ padding: 30 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              type="entypo"
              name="circle-with-plus"
              size={30}
              color={theme.colors.primary}
            />
            <Text
              style={{
                color: theme.colors.secondary,
                fontSize: 16,
                fontFamily: "Montserrat-Bold",
                marginHorizontal: 10,
              }}
            >
              Add Temperature
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 30 }}>
            <Text
              style={{
                color: theme.colors.secondary,
                fontSize: 17,
                fontFamily: "Montserrat-Bold",
              }}
            >
              Records
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomColor: "#EAEAEA",
                borderBottomWidth: 1,
                paddingVertical: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    color: theme.colors.secondary,
                    fontSize: 14,
                    fontFamily: "Montserrat-Bold",
                  }}
                >
                  Latest Record:
                </Text>
                <Text>{new Date(response[0].date).toDateString()}</Text>
              </View>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 16,
                  fontFamily: "Montserrat-Bold",
                }}
              >
                {response[0].value}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomColor: "#EAEAEA",
                borderBottomWidth: 1,
                paddingVertical: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    color: theme.colors.secondary,
                    fontSize: 14,
                    fontFamily: "Montserrat-Bold",
                  }}
                >
                  Highest Record:
                </Text>
                <Text>
                  {new Date(
                    response[
                      response.findIndex((el) => {
                        return (
                          parseInt(el.value.replace(/[\[\]&]+/g, "").trim()) ===
                          Math.max.apply(0, chartData.datasets[0].data)
                        );
                      })
                    ].date
                  ).toDateString()}
                </Text>
              </View>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 16,
                  fontFamily: "Montserrat-Bold",
                }}
              >
                {Math.max.apply(0, chartData.datasets[0].data)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomColor: "#EAEAEA",
                borderBottomWidth: 1,
                paddingVertical: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    color: theme.colors.secondary,
                    fontSize: 14,
                    fontFamily: "Montserrat-Bold",
                  }}
                >
                  Lowest Record:
                </Text>
                <Text>
                  {new Date(
                    response[
                      response.findIndex((el) => {
                        return (
                          parseInt(el.value.replace(/[\[\]&]+/g, "").trim()) ===
                          Math.min.apply(0, chartData.datasets[0].data)
                        );
                      })
                    ].date
                  ).toDateString()}
                </Text>
              </View>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 16,
                  fontFamily: "Montserrat-Bold",
                }}
              >
                {Math.min.apply(0, chartData.datasets[0].data)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

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
    fontFamily: "Montserrat-Bold",
  },
});
