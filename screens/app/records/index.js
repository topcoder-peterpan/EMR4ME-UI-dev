import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Content from "./Content";
import AllergiesList from "./AllergiesList";
import ConditionsList from "./ConditionsList";
import ImmunizationsList from "./ImmunizationsList";

import ClinicalNotes from "../document";
import DocViewer from "../document/DocViewer";

import MedicationsList from "./MedicationsList";
import VisitsList from "./VisitsList";
import LabResults from "./LabResults";
import NotesList from "./Notes";
import { fonts } from "../../../constants";
import BackButton from "../../../components/common/back-button";
import SettingsIcon from "../../../components/common/SettingsIcon";
import ShareIcon from "../../../components/common/ShareIcon";
import HelpIcon from "../../../components/common/HelpIcon";
import { View } from "react-native";

const RecordsNavigator = createStackNavigator();

export default () => {

  const recordsStackOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: "#1EB5FC",
      elevation: 0,
    },
    headerTitleStyle: {
      color: "white",
      fontFamily: fonts.MontserratBold,
      fontSize: 16,
      alignSelf: "center",
    },
    headerTitleAlign: "center",
    headerTintColor: "white",
    headerLeft: (props) => <BackButton {...props} />,
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <HelpIcon />
        <ShareIcon />
        <SettingsIcon />
      </View>
    ),
  };
  return (
    <RecordsNavigator.Navigator>
      <RecordsNavigator.Screen
        name="RecordScreen"
        component={Content}
        options={{ ...recordsStackOptions, headerLeft: null, title: "Records" }}
      />

      <RecordsNavigator.Screen
        name="Allergies"
        component={AllergiesList}
        options={recordsStackOptions}
      />

      <RecordsNavigator.Screen
        name="Medications"
        component={MedicationsList}
        options={recordsStackOptions}
      />

      <RecordsNavigator.Screen
        name="Immunization"
        component={ImmunizationsList}
        options={recordsStackOptions}
      />

      <RecordsNavigator.Screen
        name="Conditions"
        component={ConditionsList}
        options={recordsStackOptions}
      />

      <RecordsNavigator.Screen
        name="Notes"
        component={NotesList}
        options={recordsStackOptions}
      />

      <RecordsNavigator.Screen
        name="Visits"
        component={VisitsList}
        options={recordsStackOptions}
      />

      <RecordsNavigator.Screen
        name="LabResults"
        component={LabResults}
        options={{ ...recordsStackOptions, title: "Lab Results" }}
      />

      <RecordsNavigator.Screen
        name="AllDocs"
        component={ClinicalNotes}
        options={{ ...recordsStackOptions, title: "Documents" }}
      />

      <RecordsNavigator.Screen
        name="OneDocView"
        component={DocViewer}
        options={{ ...recordsStackOptions, title: "DocViewer" }}
      />

    </RecordsNavigator.Navigator>
  );
};
