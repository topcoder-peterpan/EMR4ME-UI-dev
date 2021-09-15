import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { ThemeConsumer, ListItem, SearchBar } from "react-native-elements";
import { getUserDocs } from "../../../apis/user";
import { i18n } from "../../../util";
import { fonts, theme } from "../../../constants";
import FilterIcon from "../common/FilterIcon";

export default ({ route, navigation }) => {
  const [docs, setDocs] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setDocs(null);
    getDocs();
  }, []);

  const getDocs = () => {
    getUserDocs({
      visits: [route.params.visitId],
    }).then((data) => {
      if (data.success) {
        setDocs(data.payload[0]);
        setRefreshing(false)
      }
    });
  }

  useEffect(() => {
    getDocs();
  }, []);

  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch({ search });
  };

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar
            backgroundColor={theme.colors.primary}
            barStyle="light-content"
          />
          <SafeAreaView style={styles.container}>
            <View style={styles.searchBarContainer}>
              <SearchBar
                placeholder={i18n.t("documents.searchProv")}
                onChangeText={updateSearch}
                value={search}
                lightTheme={true}
                round={true}
                containerStyle={styles.searchBarContainerStyle}
                inputContainerStyle={styles.searchBarInputContainerStyle}
                inputStyle={{ fontSize: 14, paddingLeft: 10 }}
                searchIcon={{ size: 32, color: theme.colors.primary }}
              />
              <FilterIcon />
            </View>

            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 30 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={true} />
              }
            >
              {docs.map((item, i) => (
                <ListItem
                  key={item.id}
                  containerStyle={styles.listItemContainer}
                  onPress={() => {
                    navigation.navigate("DocViewer", { id: item.id });
                  }}
                  title={item.name}
                  titleStyle={styles.titleStyle}
                  subtitleStyle={{ marginLeft: 10 }}
                  chevron={{ size: 30, color: theme.colors.error }}
                />
              ))}
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  searchBarContainerStyle: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    flex: 1,
  },
  searchBarInputContainerStyle: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 0,
    borderRadius: 23,
    paddingLeft: 10,
    alignItems: "center",
  },
  listItemContainer: {
    paddingHorizontal: 0,
    paddingVertical: 20,
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
  },
  titleStyle: {
    color: theme.colors.primary,
    fontSize: 20,
    fontFamily: fonts.MontserratBold,
    marginLeft: 10,
  },
});
