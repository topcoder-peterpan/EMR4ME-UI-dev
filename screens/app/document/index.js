import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { ThemeConsumer, SearchBar } from "react-native-elements";
import { fonts, theme, metrics } from "../../../constants";
import {
  getDocumentsIds,
  getDocumentsNames,
  getDocuments,
} from "../../../store/actions/creators/user";

import { connect, useDispatch } from "react-redux";
import { i18n } from "../../../util";
import FilterModal from "../../../components/common/filter-modal";
import { startLoading } from "../../../store/actions/creators";
import NoDataScreen from "../../../components/common/NoData";
import FilterIcon from "../common/FilterIcon";
import {
  hideCustomLoader,
  showCustomLoader,
} from "../../../store/actions/creators/UI";
import AwesomeLoader from "../../../components/common/awesome-Loader";
import RecordList from "../records/common/DatatList";
import { documents } from "../records/common/types";

const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
  myProviders: state.user.myProviders,
  selectMode: state.sharedRecords.selectMode,
  isSignout: state.user.isSignout,
});
export default connect(mapStateToProps)(
  ({ route, myProviders, navigation, isLoading, isSignout, selectMode }) => {
    const [isLinked, setIsLinked] = useState(true);
    const [docs, setDocs] = useState([]);
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [docsTypes, setDocsTypes] = useState([]);
    const [filteredDocsTypes, setFilteredDocsTypes] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
      if (isSignout) setModalVisible(false);
    }, [isSignout]);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      dispatch(hideCustomLoader());
      setLoaded(false);
      setDocs([]);
      getDocsTypes();
    }, []);

    const getVisitsData = (documentTypes, docTypesFiltered) => {
      if (refreshing) dispatch(hideCustomLoader());
      if (route && route.params && route.params.visitId) {
        getDocuments({
          names: documentTypes.filter((_, index) => docTypesFiltered[index]),
          providerId:
            route && route.params && route.params.providerId
              ? route.params.providerId
              : null,
          visitReferenceId:
            route && route.params && route.params.visitId
              ? route.params.visitId
              : null,
        })
          .then((resp) => {
            dispatch(showCustomLoader());
            setRefreshing(false);
            setLoaded(true);

            if (resp.payload && resp.payload.success)
              setDocs(resp.payload.payload);
          })
          .catch((error) => {
            console.warn(error);
          });
      } else {
        getDocumentsIds({
          names: documentTypes.filter((_, index) => docTypesFiltered[index]),
        })
          .then((resp) => {
            dispatch(showCustomLoader());
            setRefreshing(false);
            setLoaded(true);

            if (resp.payload && resp.payload.success)
              setDocs(resp.payload.payload);
          })
          .catch((error) => {
            console.warn(error);
          });
      }
    };

    const getDocsTypes = async () => {
      setDocsTypes([]);
      getDocumentsNames().then((data) => {
        const linked = myProviders ? myProviders.length > 0 : true;
        setIsLinked(linked);
        if (!linked) {
          setRefreshing(false);
          dispatch(showCustomLoader());
          setLoaded(true);
        }
        if (linked && data.payload && data.payload.success) {
          if (data.payload.payload) {
            setDocsTypes(data.payload.payload);
            const docTypesFiltered = Array.from(data.payload.payload).map(
              (o) => true
            );
            setFilteredDocsTypes(docTypesFiltered);

            if (data.payload.payload.length > 0) {
              getVisitsData(data.payload.payload, docTypesFiltered);
              dispatch(startLoading());
            } else {
              setLoaded(true);
              setRefreshing(false);
              dispatch(showCustomLoader());
            }
          }
        } else {
          setRefreshing(false);
          setLoaded(true);
          dispatch(showCustomLoader());
        }
      });
    };

    React.useEffect(() => {
      setLoaded(false);
      setDocs([]);
      getDocsTypes();
    }, [navigation]);

    const updateFilters = (search) => {
      const filterdTypes = docs
        .filter((o) =>
          search
            ? o.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
              o.auther.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
              (o.provider_name &&
                o.provider_name.toLowerCase().indexOf(search.toLowerCase()) >
                  -1)
            : true
        )
        .map((o) => o.name)
        .filter((value, index, self) => self.indexOf(value) === index);
      setDocsTypes(filterdTypes);
      const docTypesFiltered = Array.from(filterdTypes).map((o) => true);
      setFilteredDocsTypes(docTypesFiltered);
    };
    const updateSearch = (search) => {
      setSearch(search);
      updateFilters(search);
    };

    const filteredDoc = docs.filter(
      (o) =>
        (search
          ? o.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            o.auther.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (o.provider_name &&
              o.provider_name.toLowerCase().indexOf(search.toLowerCase()) > -1)
          : true) &&
        docsTypes
          .filter((_, index) => filteredDocsTypes[index])
          .includes(o.name)
    );

    let wrapper = (
      <>
        {docs && docs.length ? (
          <View
            style={[
              styles.searchView,
              selectMode ? styles.selectModeSearchContainer : null,
            ]}
          >
            <SearchBar
              placeholder={i18n.t("documents.searchHere")}
              onChangeText={updateSearch}
              value={search}
              lightTheme={true}
              round={true}
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.searchInput}
              inputStyle={{ fontSize: 14, paddingLeft: 10 }}
              searchIcon={{ size: 32, color: theme.colors.primary }}
            />
            <FilterIcon
              openFilterModal={() => {
                if (docsTypes && docsTypes.length) setModalVisible(true);
              }}
            />
          </View>
        ) : null}
        {filteredDoc && filteredDoc.length ? (
          <RecordList
            data={docs && filteredDoc}
            useListItem={true}
            type={documents}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : (
          <NoDataScreen navigation={navigation} noData={true} />
        )}
      </>
    );
    if (!loaded)
      wrapper = (
        <View style={styles.loader}>
          <AwesomeLoader />
        </View>
      );
    else if (!isLoading && myProviders && myProviders.length === 0)
      wrapper = <NoDataScreen navigation={navigation} notLinked={true} />;
    else if (!isLoading && docs && !docs.length)
      wrapper = <NoDataScreen navigation={navigation} noData={true} />;
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <>
            <StatusBar
              backgroundColor={theme.colors.primary}
              barStyle="light-content"
            />
            <FilterModal
              modalVisible={modalVisible}
              headerTitle={i18n.t("documents.filterDoc")}
              errorMessage={i18n.t("records.documents.selectFilter")}
              onClose={() => {
                setModalVisible(false);
              }}
              onFilter={() => {}}
              data={docsTypes}
              filteredTypes={filteredDocsTypes}
              setFilteredTypes={setFilteredDocsTypes}
            />

            <SafeAreaView style={styles.container}>{wrapper}</SafeAreaView>
          </>
        )}
      </ThemeConsumer>
    );
  }
);

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#00000088",
  },
  modalView: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 15,
    padding: 20,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterCheckContainer: {
    padding: 0,
    marginLeft: 0,
    marginRight: "3%",
    flexBasis: "44%",
    flexWrap: "wrap",
    overflow: "scroll",
    backgroundColor: "#FFF",
    borderWidth: 0,
    marginVertical: 8,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  filterTextStyles: {
    flexWrap: "wrap",
    fontSize: 13,
    paddingRight: 8,
    lineHeight: 18,
  },
  filterModalTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterText: {
    fontFamily: fonts.MontserratBold,
    fontSize: 20,
  },
  filterChecksContainer: {
    height: 10 * metrics.vh,
    flexDirection: "column",
    marginTop: 10,
  },
  emptyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  notLinked: {
    fontSize: 16,
    color: "#474747",
    fontFamily: fonts.MontserratBold,
    textAlign: "center",
    width: "70%",
  },
  linkedText: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    color: theme.colors.secondary,
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 2,
    backgroundColor: "white",
  },
  selectModeSearchContainer: {
    paddingRight: 5,
    paddingLeft: 30,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    flex: 1,
  },
  searchInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 0,
    borderRadius: 23,
    paddingLeft: 10,
    alignItems: "center",
  },
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: 20,
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
  },
  textItem: { fontFamily: fonts.MontserratBold, flexBasis: 80 },
  textValue: { flexWrap: "wrap", flex: 1 },
});
