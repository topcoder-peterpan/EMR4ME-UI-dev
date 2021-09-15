import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Animated as Animatable,
  View,
  TouchableOpacity,
} from "react-native";
import { ListItem, Icon, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { fonts, metrics, theme } from "../../../../constants";
import {
  Swipeable,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  getLinkByID,
  deleteLink,
  modifyExpiryDate,
  setLinks,
} from "../../../../store/actions/creators/sharedLinks";
import { showConfirmDialogue } from "../../../../store/actions/creators/UI";
import ExpiryDateModal from "../common/Selection/ExpiryDateModal";
import { i18n } from "../../../../util";
import moment from "moment";
import { startLoading } from "../../../../store/actions/creators";
import { getAllLinks } from "../../../../store/actions/creators/sharedLinks";
import { sortListDescendingByDate } from "../common/common";
import { listDoctors } from "../../../../store/actions/creators/doctors";
import SharedLinksBottomSheet from "../common/BottomSheet/SharedLinksBottomSheet";
import NoDataScreen from "../../../../components/common/NoData";
import Loader from "../../../../components/common/awesome-Loader";
import ButtonAttributes from "../../../../components/common/ButtonAttributes";
import { Doctor } from "../common/types";
import { setRecords } from "../../../../store/actions/creators/records";
import { useNavigation } from "@react-navigation/native";

export default (props) => {
  const { route } = props;

  const [showBackDrop, setShowBackDrop] = useState(false);
  const [doctors, setDoctors] = React.useState([]);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const selectedLink = useRef();

  const isAllLinks = !route.params || !route.params.docID;
  const doctorID = route.params ? route.params.docID : null;
  const docName = !route.params || !route.params.name;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isSignout = useSelector((state) => state.user.isSignout);
  const isLoading = useSelector((state) => state.UI.isLoading);
  const sharedLinks = useSelector((state) => state.sharedLinks.data);

  let bottomSheetButtons = [
    new ButtonAttributes(
      i18n.t("records.shareRecords.viewSharedData"),
      openLink,
      theme.colors.primary
    ),
    new ButtonAttributes(
      i18n.t("records.shareRecords.edit"),
      updateItem,
      theme.colors.primary
    ),
    new ButtonAttributes(
      i18n.t("records.shareRecords.updateExpiry"),
      openExpiryDateModal,
      theme.colors.primary
    ),
    new ButtonAttributes(
      i18n.t("records.shareRecords.delete"),
      openConfirmDeleteDialogue,
      theme.colors.danger
    ),
    new ButtonAttributes(
      i18n.t("records.shareRecords.cancel"),
      closeBottomSheet,
      theme.colors.secondary
    ),
  ];
  useEffect(() => {
    if (isSignout) setDateModalVisible(false);
  }, [isSignout]);

  const getLinks = () =>
    listDoctors().then((res) => {
      setDoctors(res && res.payload ? res.payload : []);
      let params = doctorID ? { doctor_id: doctorID } : {};
      getAllLinks(params)
        .then((data) => {
          if (data.statusCode == 0) {
            let sortedLinks = sortListDescendingByDate(
              data.payload,
              "creation_date"
            );
            sortedLinks = sortedLinks.filter((l) =>
              res.payload.find((d) => d.id == l.doctor_id)
            );
            dispatch(setLinks(sortedLinks));
            setLoaded(true);
          }
        })
        .catch((err) => {});
    });

  useEffect(() => {
    dispatch(startLoading());
    getLinks();
  }, [doctorID]);

  const isExpired = (item) => {
    return (
      !item.share_forever &&
      item.expiresIn.years <= 0 &&
      item.expiresIn.months <= 0 &&
      item.expiresIn.days <= 0 &&
      item.expiresIn.hours <= 0 &&
      item.expiresIn.minutes <= 0
    );
  };

  const getItemTimeLeft = (item) => {
    if (item.share_forever) return "";
    let expiresIn = item.expiresIn;
    if (expiresIn.days > 0) return `${expiresIn.days} days left`;
    else if (expiresIn.hours > 0) return `${expiresIn.hours} hours left`;
    else if (expiresIn.minutes > 0) return `${expiresIn.minutes} minutes left`;
    return "";
  };

  const openExpiryDateModal = () => {
    const linkID = selectedLink.current && selectedLink.current.link_id;
    getLinkByID({ linkId: linkID })
      .then((data) => {
        if (data.statusCode == 0) {
          const item = data.payload;
          selectedLink.current = item;
          setDateModalVisible(true);
          if (!item.share_forever)
            dispatch(
              modifyExpiryDate(item.link_id, {
                expiresIn: item.expiresIn,
                expiry_date: item.expiry_date,
              })
            );
        }
      })
      .catch((err) => {});
  };

  const updateItem = (targetItem) => {
    let item = selectedLink.current || targetItem;
    getLinkByID({ linkId: item.link_id })
      .then((data) => {
        if (data.statusCode == 0) {
          item = data.payload;
          let sharedData = {};
          let doctorName =
            (route.params && route.params.name) ||
            getDoctorName(item.doctor_id);
          sharedData[Doctor] = [
            { id: parseInt(item.doctor_id), name: doctorName },
          ];
          for (const property in item.shared_items) {
            if (item.shared_items[property].in) {
              sharedData[property] = item.shared_items[property].in.map(
                (item) => {
                  if (typeof item === "object") return item;
                  else return { id: item };
                }
              );
            }
          }
          dispatch(setRecords(item.link_id, sharedData, isAllLinks));
          navigation.navigate("Records", { screen: "RecordScreen" });
        }
      })
      .catch((err) => {});
  };

  const openConfirmDeleteDialogue = () => {
    dispatch(
      showConfirmDialogue({
        msg: i18n.t("records.shareRecords.confirmDelete"),
        title: i18n.t("records.shareRecords.deleteTitle"),
        leftButton: new ButtonAttributes(
          i18n.t("records.shareRecords.delete"),
          deleteItem,
          theme.colors.danger
        ),
      })
    );
  };

  const deleteItem = () => {
    const linkID = selectedLink.current && selectedLink.current.link_id;
    dispatch(deleteLink({ linkId: linkID }))
      .then(() => {
        closeBottomSheet();
      })
      .catch((err) => {});
    selectedLink.current = null;
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((i) => i.id == doctorId);
    return doctor ? doctor.fname + " " + doctor.lname : docName;
  };

  const getExpiryDate = (item) => {
    if (item.share_forever) return "Permanent";
    if (item.expiry_date) return moment(item.expiry_date).format("Do MMM YYYY");
    return "";
  };

  let bottomSheet = useRef();

  const openBottomSheet = (item) => {
    selectedLink.current = item;
    bottomSheet.current.snapTo(0);
    setShowBackDrop(true);
  };

  const closeBottomSheet = () => {
    selectedLink.current = null;
    bottomSheet.current.snapTo(1);
    setShowBackDrop(false);
  };

  const renderItem = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={(_, dragX) => {
          const scale = dragX.interpolate({
            inputRange: [-90, -45],
            outputRange: [1, 0],
            extrapolate: "clamp",
          });
          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  selectedLink.current = item;
                  openConfirmDeleteDialogue();
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.swipeableBox, styles.deleteBox]}>
                  <Animatable.View style={{ transform: [{ scale: scale }] }}>
                    <Icon
                      type="ionicon"
                      name="ios-trash"
                      size={30}
                      color="white"
                      containerStyle={{ padding: 3 }}
                    />
                  </Animatable.View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateItem(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.swipeableBox, styles.updateBox]}>
                  <Animatable.View style={{ transform: [{ scale: scale }] }}>
                    <Icon
                      name="edit"
                      size={30}
                      color="white"
                      containerStyle={{ padding: 3 }}
                    />
                  </Animatable.View>
                </View>
              </TouchableOpacity>
            </>
          );
        }}
      >
        <TouchableWithoutFeedback onPress={() => openBottomSheet(item)}>
          <ListItem
            key={item.link_id}
            containerStyle={[
              styles.listItemContainer,
              isExpired(item) && styles.expiredItemContainer,
            ]}
            title={
              isAllLinks ? getDoctorName(item.doctor_id) : getExpiryDate(item)
            }
            titleStyle={styles.title}
            subtitle={
              <View style={styles.subtitle}>
                <Text style={styles.doctorText}>
                  {isAllLinks && getExpiryDate(item)}
                </Text>
                <Text style={styles.expirationTimeText}>
                  {getItemTimeLeft(item)}
                </Text>
              </View>
            }
            subtitleStyle={styles.subtitleText}
          />
          {isExpired(item) && (
            <View style={styles.expiredContainer}>
              <Text style={styles.expiredText}>
                {i18n.t("records.shareRecords.expired")}
              </Text>
            </View>
          )}
        </TouchableWithoutFeedback>
      </Swipeable>
    );
  };

  const openLink = () => {
    if (selectedLink && selectedLink.current)
      navigation.navigate("LinkViewer", { id: selectedLink.current.url });
  };

  const wrapper = null;

  if (!loaded || isLoading) return <Loader />;
  else if (!sharedLinks || !sharedLinks.length)
    return <NoDataScreen noData={true} />;
  else if (loaded && sharedLinks && sharedLinks.length)
    return (
      <>
        <FlatList
          contentContainerStyle={styles.container}
          data={sharedLinks}
          renderItem={renderItem}
          keyExtractor={(item) => item.link_id + ""}
        />
        {doctorID ? (
          <View style={styles.shareWithContainer}>
            <Text style={styles.shareWithTitle}>
              {"Shared with: "}
              <Text style={styles.shareWithText}>
                {getDoctorName(doctorID)}
              </Text>
            </Text>
          </View>
        ) : null}
        <ExpiryDateModal
          modalVisible={dateModalVisible}
          selectedLink={selectedLink.current}
          onUpdate={closeBottomSheet}
          onClose={() => {
            setDateModalVisible(false);
          }}
          mode="edit"
        />
        <SharedLinksBottomSheet
          BottomSheetButtonsList={bottomSheetButtons}
          closeBottomSheet={closeBottomSheet}
          bottomSheet={bottomSheet}
          showBackDrop={showBackDrop}
          setShowBackDrop={setShowBackDrop}
        />
      </>
    );
  return;
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  listItemContainer: {
    paddingVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    margin: 6,
  },
  expiredItemContainer: {
    backgroundColor: "#F8F8F8",
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  title: {
    fontSize: 15,
    color: theme.colors.secondary,
    fontFamily: fonts.MontserratBold,
  },
  swipeableBox: {
    justifyContent: "center",
    alignItems: "center",
    width: metrics.vw * 20,
    paddingVertical: 14,
    elevation: 5,
    marginVertical: 6,
  },
  deleteBox: {
    backgroundColor: "red",
  },
  updateBox: {
    backgroundColor: theme.colors.primary,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 60,
    backgroundColor: theme.colors.primary,
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  text: {
    fontFamily: fonts.MontserratBold,
    fontSize: 20,
  },
  expiredContainer: {
    transform: [{ rotate: "35deg" }],
    position: "absolute",
    top: 20,
    right: 5,
    backgroundColor: "red",
    padding: 5,
    elevation: 10,
  },
  expiredText: {
    color: "#F8F8F8",
  },
  subtitleText: {
    paddingTop: 5,
    fontSize: 13,
  },
  subtitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  doctorText: {
    color: theme.colors.primary,
  },
  expirationTimeText: {
    color: "grey",
  },
  shareWithContainer: {
    backgroundColor: "#fbfbfb",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: -40,
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
