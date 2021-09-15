import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { images, fonts, metrics } from "../../constants";
import { i18n } from "../../util";
import { useNavigation } from "@react-navigation/native";

export default (props) => {
  const navigation = useNavigation();

  const { noData, notLinked, isComingSoon } = props;
  return (notLinked || noData) && (
    <View style={[styles.container, isComingSoon ? styles.comingSoon : null]}>
      <Image source={images.emptyScreen} />
      {notLinked && (
        <>
          <Text style={styles.text}> {i18n.t("common.notLinked")}</Text>
          <Button
            title={i18n.t("common.linkBtn")}
            buttonStyle={{ paddingHorizontal: 30, paddingVertical: 8 }}
            containerStyle={{ marginTop: 35 }}
            onPress={() =>
              navigation ? navigation.navigate("Providers") : null
            }
          />
        </>
      )}
      {noData && (isComingSoon ? <Text style={styles.text}>{i18n.t("common.comingSoon")}</Text> :
        <Text style={styles.text}>{i18n.t("common.noData")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    height: 60 * metrics.vh,
  },
  comingSoon: {
    maxHeight: 70 * metrics.vh
  },
  text: {
    fontSize: 16,
    color: "#474747",
    fontFamily: fonts.MontserratBold,
    textAlign: "center",
    width: "70%",
  },
});
