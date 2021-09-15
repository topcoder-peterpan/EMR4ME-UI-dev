import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, ListItem, Text } from "react-native-elements";
import { fonts, metrics, theme } from "../../../../../constants";
import { toDateText } from "../../../../../util/common";
import {
  Immunization,
  LabResults,
  condition,
  Doctor,
  documents,
  Notes,
  visit,
  Organization,
} from "../types";
import { i18n } from "../../../../../util";

export default (props) => {
  const { item, type, selectMode } = props;
  const isCircle = type === Doctor || type === Organization;
  let doctors = "";
  if (type === visit) {
    if (!Array.isArray(item.doctor)) doctors = item.doctor;
    else {
      const doctorArray = item.doctor
        .map((o) =>
          o.individual && o.individual.display ? o.individual.display : ""
        )
        .filter((o) => o);
      if (doctorArray.length > 0) doctors = doctorArray.join(", ");
    }
  }
  let subTitle;
  switch (type) {
    case Immunization:
      subTitle = `${item.status}`;
      break;
    case LabResults:
      subTitle = (
        <View style={styles.subtitleContainer}>
          <View style={styles.subtitleView}>
            <Text style={styles.subtitleText}>Record: </Text>
            <Text style={styles.subtitleData}>
              {toDateText(item.record_date)}
            </Text>
          </View>
          <View style={styles.subtitleView}>
            <Text style={styles.subtitleText}>Value: </Text>
            <Text style={styles.subtitleData}>{item.value}</Text>
          </View>
        </View>
      );
      break;
    case Notes:
      subTitle = (
        <View style={styles.subtitleContainer}>
          <View style={styles.subtitleView}>
            <Text style={styles.subtitleText}>Doctor: </Text>
            <Text style={styles.subtitleData}>{item.doctor_name}</Text>
          </View>
          <View style={styles.subtitleView}>
            <Text style={styles.subtitleText}>Record: </Text>
            <Text style={styles.subtitleData}>
              {/* {toDateText(item.doc_date)} */}
              {toDateText(item.effective_date)}
              {/* {moment(item.effective_date).format("DD MMM YYYY")} */}
            </Text>
          </View>
          <View style={styles.subtitleView}>
            <Text style={styles.subtitleText}>Description: </Text>
            <Text style={styles.subtitleData}>{item.text}</Text>
          </View>
        </View>
      );
      break;
    case visit:
      subTitle = doctors;
      break;
    case condition:
      subTitle = `Record: ${toDateText(item.record_date)}`;
      break;
    case documents:
      subTitle = (
        <View style={{ paddingRight: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.subtitleText}>{i18n.t("common.date")}</Text>
            <Text style={styles.subtitleData}>{toDateText(item.doc_date)}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.subtitleText}>
              {i18n.t("documents.author")}
            </Text>
            <Text style={styles.subtitleData}>{item.auther}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.subtitleText}>
              {i18n.t("documents.hospital")}
            </Text>
            <Text style={styles.subtitleData}>{item.provider_name}</Text>
          </View>
        </View>
      );
      break;
    default:
      subTitle = "";
  }

  let hasCheveron = false;
  if (
    !selectMode &&
    (((type === Notes || type === LabResults) &&
      item.documents &&
      item.documents[0] &&
      item.documents[0].id) ||
      type === documents ||
      type === visit)
  )
    hasCheveron = true;

  let title = "";
  if (type === Notes) title = item.title;
  else if (type === visit)
    title = item.provider_name + " - " + toDateText(item.visit_date);
  else title = item.name;
  return (
    <ListItem
      {...props}
      key={item.id && String(item.id) ? String(item.id) : item.id}
      containerStyle={styles.container}
      title={title}
      titleStyle={[
        styles.title,
        type === LabResults || type === Notes
          ? styles.categoryTitle
          : isCircle
          ? styles.doctorTitle
          : null,
        // type === LabResults || type === Notes || type === Doctor || type === visit || type === documents
        //?
        styles.primaryColorText,
        //: styles.secondaryColorText,
      ]}
      subtitleStyle={styles.subtitleData}
      chevron={hasCheveron ? { size: 30, color: theme.colors.error } : null}
      subtitle={subTitle}
      leftAvatar={() =>
        type === Doctor && (
          <Avatar
            size="medium"
            //source={item.photo}
            icon={{ name: "user-md", type: "font-awesome", size: 50 }}
            containerStyle={styles.avatarContainer}
          />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.MontserratBold,
  },
  doctorTitle: {
    marginTop: 20,
  },
  categoryTitle: {
    paddingLeft: 15,
  },
  primaryColorText: {
    color: theme.colors.primary,
    paddingBottom: 5,
  },
  secondaryColorText: {
    color: theme.colors.secondary,
  },
  subtitleContainer: {
    paddingRight: 10,
    paddingLeft: 15,
  },
  subtitleView: {
    flexDirection: "row",
  },
  subtitleText: {
    fontFamily: fonts.MontserratBold,
    width: metrics.vw * 25,
  },
  subtitleData: {
    flexWrap: "wrap",
    flex: 1,
    fontSize: 12,
  },
  avatarContainer: {
    borderRadius: 10,
    overflow: "hidden",
    borderColor: theme.colors.primary,
  },
});
