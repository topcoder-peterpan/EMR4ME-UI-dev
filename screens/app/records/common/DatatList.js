import React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import { Text } from "react-native-elements";
import { connect, useDispatch, useSelector } from "react-redux";
import CustomListItem from "./ListItem/CustomListItem";
import Card from "./ListItem/Card";
import SelectAllPane from "./Selection/SelectAllPane";
import RecordCheckBox from "./Selection/RecordCheckBox";
import {
  addRecord,
  removeRecord,
} from "../../../../store/actions/creators/records";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Doctor, documents, LabResults, Notes, Organization, visit } from "./types";
import { theme, fonts, metrics } from "../../../../constants";

const mapStateToProps = (state) => ({
  sharedRecords: state.sharedRecords,
});
export default connect(mapStateToProps)((props) => {
  const {
    data,
    useListItem,
    type,
    sharedRecords,
    refreshing,
    onRefresh,
  } = props;

  const selectMode = sharedRecords.selectMode;
  const initialRecords = useSelector((state) => state.sharedRecords.editRecord.initialRecords);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const isCircle = type == Doctor || type == Organization;

  const checkSharedState = (itemKey) => {
    const currentTypeSharedList = sharedRecords[type] || [];
    return currentTypeSharedList.findIndex((i) => i.id === itemKey) !== -1;
  };

  const selectRecordHandler = (item, itemSharedState) => {
    if (!selectMode) {
      if (type === Doctor)
        navigation.navigate("Doctor", {
          docID: item.id,
          doctor_id: item.id,
          ...item,
        });
      if (type === documents) {
        if (route.name === "AllDocs")
          navigation.navigate("OneDocView", { id: item.id });
        else navigation.navigate("DocViewer", { id: item.id });
      }
      if (
        (type === Notes || type === LabResults) &&
        item.documents &&
        item.documents[0] &&
        item.documents[0].id
      )
        navigation.navigate("OneDocView", { id: item.documents[0].id });
      if (type === visit)
        navigation.navigate("Documents", {
          visitId: item.reference_id,
          providerId: item.provider_id,
        });
    } else {
      if (!itemSharedState) dispatch(addRecord(item, type, isCircle, isCircle ? type === Doctor ? Organization : Doctor : null));
      else dispatch(removeRecord(item, type));
    }
  };

  const selectCategoryHandler = (item, catSharedState, itemSharedState) => {
    if (selectMode && catSharedState === itemSharedState) {
      if (!itemSharedState) dispatch(addRecord(item, type));
      else dispatch(removeRecord(item, type));
    }
  };

  const selectRecordsHandler = (category, catSharedState) => {
    category.res.forEach((item) => {
      selectCategoryHandler(item, catSharedState, checkSharedState(item.id));
    });
  };

  const checkCategorySharedState = (cat, res) => {
    let currentResultsSharedList = sharedRecords[type] || [];
    let length = currentResultsSharedList.filter((o) => o.category === cat)
      .length;
    return length === res.length;
  };

  const renderResultItem = ({ item }) => {
    const itemKey = item.id;
    const itemSharedState = checkSharedState(itemKey);
    return (
      <TouchableWithoutFeedback
        //disabled={!selectMode}
        onPress={() => selectRecordHandler(item, itemSharedState)}
        style={{ flexDirection: "row" }}
      >
        <View style={{ flexDirection: "row" }}>
          <RecordCheckBox itemSharedState={itemSharedState} itemKey={itemKey} />
          <View
            style={
              selectMode ? styles.itemWithCheckBox : styles.itemWithoutCheckbox
            }
          >
            <CustomListItem selectMode={selectMode} item={item} type={type} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderItem = ({ item }) => {
    const itemKey = item.id;
    const itemSharedState = checkSharedState(itemKey);
    return (
      <View style={styles.itemContainer}>
        {type === LabResults || type === Notes ? (
          <View style={styles.itemContainer}>
            <View
              style={
                (selectMode
                  ? styles.itemWithCheckBox
                  : styles.itemWithoutCheckbox,
                  { marginBottom: 20 })
              }
            >
              <FlatList
                ListHeaderComponent={
                  <TouchableWithoutFeedback
                    disabled={!selectMode}
                    onPress={() =>
                      selectRecordsHandler(
                        item,
                        checkCategorySharedState(item.name, item.res)
                      )
                    }
                    style={{ flexDirection: "row" }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <RecordCheckBox
                        itemSharedState={checkCategorySharedState(
                          item.name,
                          item.res
                        )}
                        itemKey={item["name"]}
                      />
                      <Text style={[styles.flatListHeader, selectMode ? styles.titleWidth : null]}>{item.name}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                }
                contentContainerStyle={
                  selectMode ? styles.selectModeContainer : styles.container
                }
                data={item.res}
                renderItem={renderResultItem}
                keyExtractor={(_, i) => i + ""}
              />
            </View>
          </View>
        ) : (
            <>
              <TouchableWithoutFeedback
                // disabled={!selectMode && type !== Doctor && type !== documents}
                onPress={() => selectRecordHandler(item, itemSharedState)}
              >
                <View style={styles.itemContainer}>
                  <RecordCheckBox
                    itemSharedState={itemSharedState}
                    itemKey={itemKey}
                  />
                  <View
                    style={
                      selectMode
                        ? styles.itemWithCheckBox
                        : styles.itemWithoutCheckbox
                    }
                  >
                    {useListItem ? (
                      type === LabResults || type === Notes ? (
                        <FlatList
                          ListHeaderComponent={
                            <View>
                              <Text style={styles.faltListHeader}>
                                {item.name}
                              </Text>
                            </View>
                          }
                          contentContainerStyle={
                            selectMode
                              ? styles.selectModeContainer
                              : styles.container
                          }
                          data={item.res}
                          renderItem={renderResultItem}
                          keyExtractor={(_, i) => i + ""}
                        />
                      ) : (
                          <CustomListItem
                            selectMode={selectMode}
                            item={item}
                            type={type}
                          />
                        )
                    ) : (
                        <Card item={item} />
                      )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </>
          )}
      </View>
    );
  };

  return (
    <>
      {selectMode && !isCircle && (
        <SelectAllPane data={data} type={type} />
      )}
      <FlatList
        contentContainerStyle={
          selectMode ? styles.selectModeContainer : styles.container
        }
        refreshControl={
          type === documents && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.error]}
              progressViewOffset={50}
            />
          )
        }
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, i) => i + ""}
      />
      {/* {showActionButton && (
        <ActionButton
          buttonColor={theme.colors.primary}
          autoInactive={true}
          size={52}
          degrees={0}
          hideShadow={false}
          renderIcon={() => (
            <Icon
              name={!selectMode ? "md-share" : "md-checkmark"}
              type="ionicon"
              color="#FFF"
            />
          )}
          onPress={() => {
            if (!selectMode) dispatch(setSelectMode(true));
            else if (type !== Doctor) navigation.navigate("ShareRecords");
          }}
        />
      )} */}
      {/* <CheckoutButton type={type} /> */}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  selectModeContainer: {
    paddingRight: 40,
    paddingLeft: 0,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemWithCheckBox: { flexBasis: "90%" },
  itemWithoutCheckbox: { flexBasis: "100%" },
  flatListHeader: {
    paddingTop: 15,
    fontSize: 18,
    fontFamily: fonts.MontserratBold,
    color: theme.colors.secondary,
  },
  titleWidth: {
    width: metrics.vw * 70,
  }
});
