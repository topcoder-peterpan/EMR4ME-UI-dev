import React, { useCallback, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import { SearchBar, Icon, Text } from "react-native-elements";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { i18n } from "../../../util";
import { theme, fonts, metrics } from "./../../../constants";
import PageContainer from "../common/PageContainer";
import ActionButton from "react-native-action-button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  getAllLinks,
  setLinks,
} from "../../../store/actions/creators/sharedLinks";
import { sortListDescendingByDate } from "./common/common";

import MyDoctors from "./Doctors/Doctors-List";
import { listDoctors } from "../../../store/actions/creators/doctors";
import { startLoading } from "../../../store/actions/creators";
import { showHelpPopup } from "../../../store/actions/creators/UI";
import ButtonAttributes from "../../../components/common/ButtonAttributes";
import SelectionPane from "./common/Selection/SelectionPane";
import { Doctor, Organization } from "./common/types";
import MyCircles from "./Doctors/Organizations";
import { getAllOrganizations } from "../../../store/actions/creators/organization";

const initialLayout = { width: metrics.screenWidth };

export default (props) => {
  const navigation = useNavigation();
  const selectMode = useSelector((state) => state.sharedRecords.selectMode);
  const editMode = useSelector((state) => state.sharedRecords.editRecord.mode);
  const sharedLinks = useSelector((state) => state.sharedLinks.data);

  const dispatch = useDispatch();

  const [search, setSearch] = React.useState("");
  const updateSearch = (search) => {
    setSearch(search);
  };

  const [doctors, setDoctors] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [type, setType] = React.useState(Doctor);
  const [loaded, setLoaded] = React.useState(false);
  const [organizationsLoaded, setOrganizationsLoaded] = React.useState(false);
  const [routes] = React.useState([
    { key: "first", title: "My Circle" },
    { key: "second", title: "Organizations" },
  ]);

  const getLinks = () => {
    getAllLinks({})
      .then((data) => {
        if (data.statusCode == 0) {
          dispatch(
            setLinks(sortListDescendingByDate(data.payload, "creation_date"))
          );
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setType(index === 0 ? Doctor : Organization);
  }, [index]);

  const getAllOrganizatons = () =>
    getAllOrganizations()
      .then((response) => {
        setOrganizationsLoaded(true);
        setOrganizations(response && response.payload ? response.payload : []);
      })
      .catch((_) => setOrganizationsLoaded(true));

  const getAllDoctors = () =>
    listDoctors()
      .then((doctors) => {
        setLoaded(true);
        setDoctors(doctors && doctors.payload ? doctors.payload : []);
      })
      .catch((_) => setLoaded(true));

  useEffect(() => {
    dispatch(startLoading());
    getAllDoctors();
    getAllOrganizatons();
    getLinks();
  }, []);

  useEffect(() => {
    if (selectMode && loaded && !editMode) {
      dispatch(
        showHelpPopup({
          msg: (
            <Text style={{ fontSize: 18 }}>
              {i18n.t("records.shareRecords.selectDoctorHelp")}
            </Text>
          ),
          title: i18n.t("records.shareRecords.helpTitle"),
          leftButton: new ButtonAttributes(
            i18n.t("records.shareRecords.ok"),
            () => {},
            theme.colors.primary
          ),
        })
      );
      // dispatch(startLoading());
      // getAllDoctors();
      // getLinks();
    }
  }, [loaded, selectMode]);

  useEffect(() => {
    if (
      props.route.params &&
      (props.route.params.added ||
        props.route.params.updated ||
        props.route.params.deleted)
    ) {
      dispatch(startLoading());
      getAllDoctors();
      getAllOrganizations();
      getLinks();
    }
  }, [props.route.params]);

  const getFilteredDoctors = () => {
    let allDoctors = doctors.filter((o) =>
      search
        ? o.fname.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
          o.lname.toLowerCase().indexOf(search.toLowerCase()) > -1
        : true
    );
    // if (selectMode) {
    //   allDoctors.filter(doc => sharedLinks.findIndex(link => link.doctor_id === doc.Id) === -1)
    // }
    return allDoctors;
  };

  const getFilteredOrganizations = () => {
    let allOrganizations = organizations.filter((o) =>
      search && o.organization_name
        ? o.organization_name.toLowerCase().indexOf(search.toLowerCase()) > -1
        : !!o.organization_name
    );
    return allOrganizations;
  };

  const renderScene = SceneMap({
    first: useCallback(
      () => (
        <>
          <MyDoctors
            loaded={loaded}
            data={
              doctors && doctors.length && Array.isArray(doctors)
                ? getFilteredDoctors()
                : []
            }
          />
        </>
      ),
      [doctors, search, selectMode, loaded]
    ),
    second: useCallback(
      () => (
        <>
          <MyCircles
            loaded={organizationsLoaded}
            data={
              organizations &&
              organizations.length &&
              Array.isArray(organizations)
                ? getFilteredOrganizations()
                : []
            }
          />
        </>
      ),
      [organizations, search, selectMode, organizationsLoaded]
    ),
  });

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: theme.colors.error, height: 3 }}
        style={styles.tabBar}
        inactiveColor="#707070"
        activeColor={theme.colors.error}
      />
    );
  };

  return (
    <PageContainer>
      <View style={styles.scrollViewContainer}>
        <View style={styles.searchContainer}>
          {loaded ? (
            <SearchBar
              placeholder={i18n.t("records.shareRecords.searchPlaceHolder")}
              onChangeText={updateSearch}
              value={search}
              lightTheme={true}
              round={true}
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInput}
              searchIcon={{
                size: 32,
                color: theme.colors.primary,
              }}
            />
          ) : null}
        </View>
        <View style={styles.tabViewContainer}>
          {selectMode && <SelectionPane type={type} />}
          {loaded ? (
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
            />
          ) : null}
        </View>
      </View>
      {index === 0 && (
        <>
          <ActionButton
            buttonColor={theme.colors.primary}
            autoInactive={true}
            size={52}
            degrees={0}
            hideShadow={false}
            renderIcon={() => (
              <Icon name="md-add" type="ionicon" color="#FFF" />
            )}
            onPress={() => navigation.navigate("AddDoctor")}
          />
        </>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  doctorContainer: {
    paddingHorizontal: 0,
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
  },
  avatarContainer: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  doctorTitle: {
    color: theme.colors.primary,
    fontSize: 17,
    fontFamily: fonts.MontserratBold,
    marginLeft: 10,
  },
  myCirclesContainer: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#FFF",
    elevation: 3,
  },
  scrollViewContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  scrollViewHeader: {
    color: theme.colors.secondary,
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 10,
  },
  searchButton: {
    marginLeft: 10,
  },
  searchbuttonText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontFamily: fonts.MontserratBold,
  },
  tabViewContainer: {
    marginTop: 10,
    marginBottom: 100,
    height: 75 * metrics.vh,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    flex: 1,
  },
  searchInputContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 0,
    borderRadius: 23,
    paddingLeft: 10,
    alignItems: "center",
  },
  searchInput: {
    fontSize: 14,
    paddingLeft: 10,
  },
  addBtn: {
    bottom: 0,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 80,
    backgroundColor: theme.colors.primary,
  },
});
