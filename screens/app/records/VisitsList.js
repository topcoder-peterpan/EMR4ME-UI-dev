import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getAllVisits } from "../../../store/actions/creators/user";
import PageContainer from "../common/PageContainer";
import RecordList from "./common/DatatList";
import { DataContext } from "../../../components/common/DataContext";
import { theme } from "../../../constants";
import { visit } from "./common/types";
import { showNoDataScreen } from "./common/common";
import { ThemeConsumer } from "react-native-elements";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native";
import AwesomeLoader from "../../../components/common/awesome-Loader";

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  myProviders: state.user.myProviders,
  isLoading: state.UI.isLoading,
  showCustomLoader: state.UI.showCustomLoader,
  hideLoader: state.UI.hideLoader
});
export default connect(mapStateToProps)((props) => {
  const [visitsList, setVisitsList] = useState([]);
  const [isLinked, setIsLinked] = useState(true);
  const { userData, myProviders, navigation, isLoading, showCustomLoader, hideLoader } = props;
  const [loaded, setLoaded] = useState(false);
  const selectMode = useSelector(state => state.sharedRecords.selectMode);
  const getAllData = () => {
    getAllVisits({ sessionKey: userData.sessionKey }).then((data) => {
      setLoaded(true);
      setIsLinked(myProviders ? myProviders.length > 0 : true);
      if (data.payload.success) {
        setVisitsList(data.payload.payload);
      } else setVisitsList([]);
    });
  };

  useEffect(() => {
    if (selectMode) {
      getAllData();
    } else {
      if (navigation && navigation.dangerouslyGetParent) {
        const unsubscribe = () => {
          navigation.dangerouslyGetParent().addListener("focus", () => {
            getAllData();
          });
          navigation.dangerouslyGetParent().addListener("blur", () => {
            setLoaded(false);
          });
        };
        unsubscribe();
      }
    }
  }, []);

  const dataContext = {
    opacity: 0.85,
    headerProp: "provider_name",
    themeColor: theme.colors.primary,
    isVisits: true,
  };

  const noDataScreen = showNoDataScreen(
    visitsList,
    loaded,
    isLinked,
    null,
    true
  );

  const RenderVisitsList = useCallback(
    () => <RecordList data={visitsList} type={visit} useListItem={true} isVisits={true} />,
    [visitsList]
  );
  let wrapper = null;
  if (loaded && visitsList && visitsList.length)
    wrapper = <RenderVisitsList />
  else if (isLoading && showCustomLoader && !hideLoader)
    wrapper = <AwesomeLoader />;
  else if (noDataScreen !== false)
    wrapper = noDataScreen;

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar
            backgroundColor={theme.colors.primary}
            barStyle={"light-content"}
          />
          <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {wrapper}
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>

  );
});
