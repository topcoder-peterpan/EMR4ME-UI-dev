import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Image, View } from "react-native";
import {
  ThemeConsumer,
  Text,
  ListItem,
  Button,
  Avatar,
} from "react-native-elements";
import { connect, useSelector } from "react-redux";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontistoIcon from "react-native-vector-icons/Fontisto";
import { images, theme, fonts } from "../../../constants";
import { ScrollView } from "react-native-gesture-handler";
import { i18n } from "../../../util";
import {
  allergies,
  medication,
  condition,
  Immunization,
  visit,
  LabResults,
  Notes,
  RecordsHome,
  Doctor,
  documents,
} from "./common/types";
import * as Animatable from "react-native-animatable";
import SelectionPane from "./common/Selection/SelectionPane";
import DataModal from "./common/Selection/DataModal";
import AllergiesList from "./AllergiesList";
import MedicationList from "./MedicationsList";
import ImmunizationList from "./ImmunizationsList";
import ConditionsList from "./ConditionsList";
import LabResultsList from "./LabResults";
import NotesList from "./Notes";
import VisitsList from "./VisitsList";
import DocumentsList from "../document/index";

const mapStateToProps = (state) => ({
  selectMode: state.sharedRecords.selectMode,
  sharedRecords: state.sharedRecords,
  allergiesList: state.sharedRecords[allergies],
  medicationList: state.sharedRecords[medication],
  conditionList: state.sharedRecords[condition],
  immunizationList: state.sharedRecords[Immunization],
  visitsList: state.sharedRecords[visit],
  labResultsList: state.sharedRecords[LabResults],
  notesList: state.sharedRecords[Notes],
  documentsList: state.sharedRecords[documents],
  isSignout: state.user.isSignout,
});
export default connect(mapStateToProps)((props) => {
  const [isLinked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const ChildComponent = useRef(null);
  const title = useRef("");
  const selectedDoctor = useSelector((state) => state.sharedRecords[Doctor]);

  const {
    navigation,
    selectMode,
    allergiesList,
    medicationList,
    conditionList,
    immunizationList,
    visitsList,
    labResultsList,
    notesList,
    documentsList,
    isSignout,
  } = props;

  useEffect(() => {
    if (isSignout) setModalVisible(false);
  }, [isSignout]);

  const getCountIcon = (list) => {
    return (
      selectMode &&
      list &&
      list.length && (
        <Animatable.View
          animation="fadeIn"
          duration={3000}
          useNativeDriver={true}
        >
          <Avatar
            rounded
            title={list.length + ""}
            titleStyle={{ fontSize: 15 }}
            overlayContainerStyle={{ backgroundColor: theme.colors.secondary }}
            size="small"
          />
        </Animatable.View>
      )
    );
  };

  const pressHandler = (pageName, component, headerTitle) => {
    if (selectMode) {
      setModalVisible(true);
      ChildComponent.current = component;
      title.current = headerTitle;
    } else navigation.navigate(pageName);
  };

  const list = [
    {
      title: i18n.t("records.allergies.allergies"),
      icon: <FontAwesome5Icon name="allergies" size={34} color="#1EB5FC" />,
      navigateTo: "Allergies",
      component: AllergiesList,
      countIcon: getCountIcon(allergiesList),
    },
    {
      title: i18n.t("records.content.medicatios"),
      icon: <FontistoIcon name="pills" size={30} color="#1EB5FC" />,
      navigateTo: "Medications",
      component: MedicationList,
      countIcon: getCountIcon(medicationList),
    },
    {
      title: i18n.t("records.content.immunizations"),
      icon: <FontistoIcon name="laboratory" size={31} color="#1EB5FC" />,
      navigateTo: "Immunization",
      component: ImmunizationList,
      countIcon: getCountIcon(immunizationList),
    },
    {
      title: i18n.t("records.content.conditions"),
      icon: <FontistoIcon name="bed-patient" size={30} color="#1EB5FC" />,
      navigateTo: "Conditions",
      component: ConditionsList,
      countIcon: getCountIcon(conditionList),
    },
    {
      title: i18n.t("records.content.labResults"),
      icon: <FontistoIcon name="jekyll" size={52} color="#1EB5FC" />,
      navigateTo: "LabResults",
      component: LabResultsList,
      countIcon: getCountIcon(labResultsList),
    },
    {
      title: i18n.t("records.content.notes"),
      icon: <FontistoIcon name="file-1" size={37} color="#1EB5FC" />,
      navigateTo: "Notes",
      component: NotesList,
      countIcon: getCountIcon(notesList),
    },
    {
      title: "Documents",
      icon: <FontistoIcon name="file-2" size={37} color="#1EB5FC" />,
      navigateTo: "AllDocs",
      component: DocumentsList,
      countIcon: getCountIcon(documentsList),
    },
  ];

  if (selectMode)
    list.push(
      ...[
        {
          title: "Visits",
          icon: <FontistoIcon name="prescription" size={37} color="#1EB5FC" />,
          navigateTo: "Visits",
          component: VisitsList,
          countIcon: getCountIcon(visitsList),
        },
      ]
    );

  return isLinked ? (
    <View style={styles.notLinkedView}>
      <Image source={images.emptyScreen} />
      <Text style={styles.notLinkedText}>
        {i18n.t("records.content.notLinked")}
      </Text>
      <Button
        title={i18n.t("records.content.link")}
        buttonStyle={styles.notLinkedButton}
        containerStyle={styles.container}
        onPress={() => {
          navigation.navigate("Providers");
        }}
      />
    </View>
  ) : (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar style={styles.linkedStatusBar} barStyle="light-content" />
          <SafeAreaView style={styles.safeAreaContainer}>
            <SelectionPane type={RecordsHome} />
            <DataModal
              modalVisible={modalVisible}
              title={title.current}
              onClose={() => {
                setModalVisible(false);
              }}
            >
              {ChildComponent.current && (
                <ChildComponent.current navigation={navigation} />
              )}
            </DataModal>
            <ScrollView
              contentContainerStyle={[
                styles.scrollView,
                { marginTop: selectMode ? -20 : 0 },
              ]}
            >
              <View style={styles.container}>
                {list.map((item, i) => (
                  <ListItem
                    key={i}
                    containerStyle={styles.itemContainer}
                    onPress={() =>
                      pressHandler(item.navigateTo, item.component, item.title)
                    }
                    title={item.title}
                    titleStyle={styles.title}
                    subtitle={item.subtitle}
                    subtitleStyle={styles.subTitle}
                    leftIcon={item.icon}
                    chevron={styles.chevron}
                    rightIcon={item.countIcon}
                  />
                ))}
              </View>
            </ScrollView>
            {selectedDoctor && selectedDoctor.length ? (
              <View style={styles.shareWithContainer}>
                <Text style={styles.shareWithTitle}>
                  {"Sharing with: "}
                  <Text style={styles.shareWithText}>
                    {selectedDoctor[0].name}
                  </Text>
                </Text>
              </View>
            ) : null}
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  );
});

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    padding: 30,
    paddingTop: 10,
  },
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notLinkedView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  notLinkedText: {
    fontSize: 16,
    color: "#474747",
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    width: "70%",
  },
  notLinkedButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  container: {},
  linkedStatusBar: {
    backgroundColor: theme.colors.primary,
  },
  linkedText: {
    color: theme.colors.secondary,
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
    paddingBottom: 10,
  },
  itemContainer: {
    paddingHorizontal: 0,
    paddingVertical: 30,
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
  },
  title: {
    color: theme.colors.secondary,
    fontSize: 20,
    fontFamily: fonts.MontserratBold,
    marginLeft: 10,
  },
  subTitle: {
    marginLeft: 10,
  },
  chevron: {
    fontSize: 30,
    color: theme.colors.error,
  },
  shareWithContainer: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  shareWithTitle: {
    color: theme.colors.primary,
    fontSize: 20,
  },
  shareWithText: {
    color: theme.colors.secondary,
    fontSize: 18,
  },
});
