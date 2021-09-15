import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { getAllNotes } from "../../../store/actions/creators/user";
import { i18n } from "../../../util";
import { theme, fonts, metrics } from "./../../../constants";
import FilterModal from "../../../components/common/filter-modal";
import { connect, useDispatch } from "react-redux";
import { startLoading } from "../../../store/actions/creators/UI";
import PageContainer from "../common/PageContainer";
import FilterIcon from "../common/FilterIcon";
import { showNoDataScreen } from "./common/common";
import { Notes } from "./common/types";
import RecordList from "./common/DatatList";

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  myProviders: state.user.myProviders,
  isSignout: state.user.isSignout,
  selectMode:state.sharedRecords.selectMode
});
export default connect(mapStateToProps)((props) => {
  const dispatch = useDispatch();
  const [results, setResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultsTypes, setResultsTypes] = useState([]);
  const [filteredResultsTypes, setFilteredResultsTypes] = useState([]);
  const [search, setSearch] = useState("");
  const { userData, myProviders, isSignout ,selectMode} = props;
  const [isLinked, setIsLinked] = useState(true);
  const [loaded, setLoaded] = useState(false);
  let finalResults = [];

  useEffect(() => {
    if (isSignout)
      setModalVisible(false);
  }, [isSignout]);

  const getAllData = () => {
    getAllNotes({ sessionKey: userData.sessionKey })
      .then((data) => {
        setIsLinked(myProviders ? myProviders.length > 0 : true);

        if (data.payload && data.payload.success) {
          if (
            data.payload.payload &&
            data.payload.payload[0] &&
            data.payload.payload[0].length > 0
          ) {
            let CategoriesList = Array.from(
              new Set(data.payload.payload[0].map((o) => o.category))
            );
            let NotesList = data.payload.payload[0];
            setResultsTypes(CategoriesList);
            const filteredTypes = Array.from(CategoriesList).map((o) => true);
            setFilteredResultsTypes(filteredTypes);
            setResults(NotesList);
            setLoaded(true);
          } else {
            setLoaded(true);
          }
        } else {
          setLoaded(true);
        }
      })
      .catch((error) => {
        setLoaded(true);
        console.warn(error);
      });
  };

  useEffect(() => {
    getAllData();
  }, []);

  const updateFilters = (search) => {
    const filterdTypes = results
      .filter((o) =>
        search
          ? o.category.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (o.doctor_name &&
              o.doctor_name.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
            (o.text &&
              o.text.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
            (o.title &&
              o.title.toLowerCase().indexOf(search.toLowerCase()) > -1)
          : true
      )
      .map((o) => o.category)
      .filter((value, index, self) => self.indexOf(value) === index);
    setResultsTypes(filterdTypes);
    setFilteredResultsTypes(Array.from(filterdTypes).map((o) => true));
  };

  const updateSearch = (search) => {
    setSearch(search);
    updateFilters(search);
  };

  const filteredData = results.filter(
    (o) =>
      (search
        ? o.category.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
          (o.doctor_name &&
            o.doctor_name.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
          (o.text && o.text.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
          (o.title && o.title.toLowerCase().indexOf(search.toLowerCase()) > -1)
        : true) &&
      resultsTypes
        .filter((_, index) => filteredResultsTypes[index])
        .includes(o.category)
  );
  resultsTypes.forEach((cat, index) => {
    if (filteredResultsTypes[index]) {
      finalResults.push({
        id: index + 1,
        name: cat,
        res: filteredData.filter(function (result) {
          return result.category === cat;
        }),
      });
    }
  });

  const noDataScreen = showNoDataScreen(
    filteredData,
    loaded,
    isLinked,
    filteredResultsTypes
  );

  const searchBar = (
    <View style={[styles.searchContainer , selectMode? styles.selectModeSearchContainer:null]}>
      <SearchBar
        placeholder={i18n.t("documents.searchProv")}
        onChangeText={updateSearch}
        value={search}
        lightTheme={true}
        round={true}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={{ fontSize: 14, paddingLeft: 10 }}
        searchIcon={{ size: 32, color: theme.colors.primary }}
      />
      <FilterIcon
        openFilterModal={() => {
          setModalVisible(true);
        }}
      />
    </View>
  );

  let wrapper = noDataScreen;
  if (wrapper === false) {
    wrapper = (
      <>
        <RecordList data={finalResults} useListItem={true} type={Notes} />
      </>
    );
  }
  return (
    <PageContainer>
      <FilterModal
        modalVisible={modalVisible}
        headerTitle={i18n.t("records.notes.filterType")}
        errorMessage={i18n.t("records.notes.selectFilter")}
        onClose={() => {
          setModalVisible(false);
        }}
        onFilter={() => {}}
        data={resultsTypes}
        filteredTypes={filteredResultsTypes}
        setFilteredTypes={setFilteredResultsTypes}
      />
      {loaded ? <>{searchBar}</> : null}
      {wrapper}
    </PageContainer>
  );
});
const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    marginBottom: 8 * metrics.vh,
  },
  filter: {
    color: theme.colors.primary,
    fontSize: 13,
    fontFamily: fonts.MontserratBold,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 2,
    backgroundColor: "white",
  },
  selectModeSearchContainer:{
    paddingRight: 5,
    paddingLeft: 30,
  },
  containerStyle: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    flex: 1,
  },
  inputContainerStyle: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 0,
    borderRadius: 23,
    paddingLeft: 10,
    alignItems: "center",
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
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
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
});
