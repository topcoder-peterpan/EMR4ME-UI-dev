import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
} from "react-native";
import {
  ThemeConsumer,
  Text,
  ListItem,
  Button,
  SearchBar,
  Icon,
} from "react-native-elements";

import { connect, useDispatch } from "react-redux";
import store from "./../store/configStore";
import {
  clearProviders,
  providerLinked,
  linkProvider,
  searchProviders,
  getProvidersStarted,
  linkEpic,
  linkGeneric,
} from "../store/actions/creators/user";
import { i18n } from "../util";
import { fonts, theme, metrics } from "../constants";
import {
  showAlert,
  setWebViewOpen,
} from "../store/actions/creators/UI";
import NoDataScreen from "../components/common/NoData";
import AwesomeLoader from "../components/common/awesome-Loader";

const mapStateToProps = (state) => ({
  providers: state.user.providers,
  isLoading: state.user.isLoading,
  userData: state.user.userData,
  providersLoaded: state.user.providersLoaded,
});

export default connect(mapStateToProps)((props) => {
  const { providers, isLoading, userData, navigation, providersLoaded } = props;
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchTxt, setSearchTxt] = useState("");
  const [timeOut, setMyTimeout] = useState(null);
  const [offset, setOffset] = useState(0);
  const [blockedProviderId, blockButtons] = useState(null);

  const getProvidersList = (start, val) => {
    let searchValue = val ? val.trim() : "";
    if (val === undefined) searchValue = search ? search.trim() : "";
    dispatch(getProvidersStarted());
    dispatch(
      searchProviders({
        providerName: searchValue,
        pageSize: metrics.loadingListCount,
        offset: start || 0,
      })
    );
  };

  const updateSearch = (val) => {
    setSearchTxt(val);
    if (timeOut) clearTimeout(timeOut);
    setMyTimeout(
      setTimeout(function () {
        dispatch(clearProviders());
        setSearch(val);
        getProvidersList(0, val);
        setOffset(0);
      }, 1000)
    );
  };

  React.useEffect(() => {
    if (navigation) {
      const unsubscribe = () => {
        navigation.addListener("focus", () => {
          const webViewOpened = store.getState().UI.webViewOpened;
          if (!webViewOpened) {
            dispatch(clearProviders());
            updateSearch("");
          }
          dispatch(setWebViewOpen(false));
        });
        navigation.addListener("blur", () => {
          //dispatch(clearProviders());
        });
      };
      unsubscribe();
    }
  }, [navigation]);

  useEffect(() => {
    if (offset !== 0) getProvidersList(offset);
  }, [offset]);

  const formatString = (currentString, valueToAdd) => {
    if (valueToAdd) {
      if (currentString) currentString += ", ";
      currentString += valueToAdd;
    }
    return currentString;
  };

  const getSubtitle = (item) => {
    let result = "";
    if (item.address) result += `${item.address}`;
    result = formatString(result, item.city);
    result = formatString(result, item.state);
    return result;
  };

  const renderRow = ({ item }) => {
    return (
      <ListItem
        key={item.providerId}
        containerStyle={styles.listItemContainer}
        title={item.providerName}
        titleStyle={styles.listItemTitle}
        subtitle={getSubtitle(item)}
        subtitleStyle={{ marginLeft: 10, color: theme.colors.secondary }}
        rightElement={() => {
          const indi = (
            <ActivityIndicator
              color={theme.colors.primary}
              size={40}
              style={{ paddingVertical: 5, width: 100 }}
            />
          );
          const btns =
            item.lastSynchDate == null ? (
              <Button
                disabled={blockedProviderId ? true : false}
                title={
                  item.lastSynchDate
                    ? i18n.t("common.linked")
                    : i18n.t("common.link")
                }
                buttonStyle={{ paddingVertical: 5, width: 100 }}
                titleStyle={{ fontSize: 14 }}
                // disabled={!!item.lastSynchDate}
                // disabledTitleStyle={{ color: theme.colors.success }}
                // disabledStyle={{ backgroundColor: 'transparent' }}
                onPress={() => {
                  LinkProvider(item.providerId, item.integrationTypeId);
                }}
                icon={
                  // item.lastSynchDate != null ? (
                  //     <Icon name="md-done-all" type="ionicon" size={20} color={theme.colors.success} containerStyle={{ marginLeft: 5 }} />
                  // ) : (
                  blockedProviderId === item.providerId ? (
                    <Icon
                      name="loading"
                      type="ionicon"
                      size={18}
                      color="white"
                      containerStyle={{ marginLeft: 5 }}
                    />
                  ) : (
                    <Icon
                      name="ios-link"
                      type="ionicon"
                      size={18}
                      color="white"
                      containerStyle={{ marginLeft: 5 }}
                    />
                  )
                  // )
                }
                iconRight
              />
            ) : (
              <Button
                disabled={blockedProviderId ? true : false}
                title={i18n.t("common.reSync")}
                buttonStyle={{
                  paddingVertical: 5,
                  width: 100,
                  backgroundColor: "#009900",
                }}
                titleStyle={{ fontSize: 14 }}
                // disabledStyle={{ backgroundColor: 'transparent' }}
                onPress={() => {
                  LinkProvider(item.providerId, item.integrationTypeId);
                }}
                icon={
                  <Icon
                    name="sync"
                    type="ion-icon"
                    size={20}
                    color="white"
                    containerStyle={{ marginLeft: 5 }}
                  />
                  /* <Icon type="ion-icon" name="sync" sise={20} color="blue"/> */
                }
                iconRight
              />
            );
          return (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {blockedProviderId === item.providerId ? indi : btns}
            </View>
          );
        }}
      />
    );
  };

  const loadMore = () => {
    let newOffset = providers.length;
    if (!isLoading && providers.length > 11) {
      setOffset(newOffset);
    }
  };

  const RenderFooter = () => {
    let loader = null;
    //if(isLoading)
    loader = <AwesomeLoader withoutFlickers={true} />;
    return <View>{providers.length > 8 ? loader : null}</View>;
  };

  const syncEpic = (providerId) => {
    if (providerId) {
      linkEpic({ providerId }).then((resp) => {
        if (resp.statusCode === 0) {
          let linked = providers.find(
            (p) => p.providerId === providerId
          );
          dispatch(providerLinked(providerId));
          dispatch(
            showAlert({
              msg: linked
                ? i18n.t("providers.syncSucceess")
                : i18n.t("providers.linkSucceess"),
              type: "info",
              present: false,
              iconName: "info-circle",
            })
          );
        } else {
          dispatch(
            showAlert({
              msg: i18n.t("providers.linkFailed"),
              type: "error",
              present: false,
              iconName: "warning",
            })
          );
        }
      });
    }
  };

  const syncGeneric = (providerId) => {
    if (providerId) {
      linkGeneric({ providerId }).then((resp) => {
        if (resp.statusCode === 0) {
          let linked = providers.find(
            (p) => p.providerId === providerId
          );
          dispatch(providerLinked(providerId));
          dispatch(
            showAlert({
              msg: linked
                ? i18n.t("providers.syncSucceess")
                : i18n.t("providers.linkSucceess"),
              type: "info",
              present: false,
              iconName: "info-circle",
            })
          );
        } else {
          dispatch(
            showAlert({
              msg: i18n.t("providers.linkFailed"),
              type: "error",
              present: false,
              iconName: "warning",
            })
          );
        }
      });
    }
  };

  const LinkProvider = (providerID, integrationTypeId) => {
    let data = {
      userId: userData.userModel.user_id,
      providerId: providerID,
      sessionKey: userData.sessionKey,
    };
    let integrationId = integrationTypeId;
    blockButtons(providerID);
    linkProvider(data)
      .then((response) => {
        blockButtons(null);
        if (response.statusCode == 0) {
          if (
            response.payload != null &&
            typeof response.payload === "string"
          ) {
            let link = response.payload;
            // let integrationTypeId = integrationId;
            props.navigation.navigate("LinkProvider", {
              link,
              providerID,
              integrationId,
              providers,
            });
          } else {
            if (integrationId === 6) syncEpic(providerID);
            else if (integrationId === 8) syncGeneric(providerID);
            else {
              const linked = providers.find((p) => p.providerId === providerID);
              dispatch(providerLinked(providerID));
              dispatch(
                showAlert({
                  msg: linked
                    ? i18n.t("providers.syncSucceess")
                    : i18n.t("providers.linkSucceess"),
                  type: "info",
                  present: false,
                  iconName: "info-circle",
                })
              );
            }
          }
        } else if (response.statusCode == -500) {
          dispatch(
            showAlert({
              msg: i18n.t("providers.patientNotFound"),
              type: "error",
              present: false,
              iconName: "warning",
            })
          );
        } else {
          dispatch(
            showAlert({
              msg: i18n.t("providers.linkFailed"),
              type: "error",
              present: false,
              iconName: "warning",
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          showAlert({
            msg: i18n.t("providers.linkFailed"),
            type: "error",
            present: false,
            iconName: "warning",
          })
        );
      });
  };

  let wrapper = null;
  if (!providersLoaded)
    wrapper = (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AwesomeLoader />
      </View>
    );
  else if (providersLoaded && providers && providers.length > 0)
    wrapper = (
      <FlatList
        style={{ paddingHorizontal: 30 }}
        data={providers}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={RenderFooter}
      />
    );
  else if (providersLoaded && !isLoading && providers && !providers.length)
    wrapper = <NoDataScreen noData={true} />;

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar
            backgroundColor={theme.colors.primary}
            barStyle="light-content"
          />
          <KeyboardAvoidingView style={styles.container}>
            {/* <Spinner visible={spinner} /> */}

            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <>
                <View style={styles.headingContainer}>
                  <Text style={styles.title}>
                    {i18n.t("providers.addProvider")}
                  </Text>
                  <Text style={{ color: "#BCBCBC" }}>
                    {i18n.t("providers.chooseHospital")}
                  </Text>
                  <View style={styles.searchBar}>
                    <SearchBar
                      placeholder={i18n.t("providers.searchByProv")}
                      onChangeText={updateSearch}
                      value={searchTxt}
                      lightTheme={true}
                      round={true}
                      containerStyle={styles.searchBarContainer}
                      inputContainerStyle={styles.inputContainerStyle}
                      inputStyle={{ fontSize: 14, paddingLeft: 10 }}
                      searchIcon={{ size: 32, color: theme.colors.primary }}
                    />
                  </View>
                </View>
                {wrapper}
              </>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </>
      )}
    </ThemeConsumer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: theme.colors.secondary,
    fontFamily: fonts.MontserratBold,
    fontSize: 24,
  },
  headingContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  searchBarContainer: {
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
  filter: {
    color: theme.colors.primary,
    fontSize: 13,
    fontFamily: fonts.MontserratBold,
  },
  listItemContainer: {
    paddingHorizontal: 0,
    paddingVertical: 20,
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
  },
  listItemTitle: {
    color: theme.colors.primary,
    fontSize: 20,
    fontFamily: fonts.MontserratBold,
    marginLeft: 10,
  },
  noDataView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  noDataViewText: {
    fontSize: 16,
    color: "#474747",
    fontFamily: fonts.MontserratBold,
    textAlign: "center",
    width: "70%",
  },
});
