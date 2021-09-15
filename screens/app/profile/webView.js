import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import {
  StatusBar,
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ThemeConsumer } from "react-native-elements";
import CloseIcon from "../../../components/common/close-icon";
import {
  checkLinkProvider,
  providerLinked,
  linkEpic,
  linkGeneric,
} from "../../../store/actions/creators/user";
import { useDispatch } from "react-redux";
import { showAlert, setWebViewOpen } from "../../../store/actions/creators/UI";
import { i18n } from "../../../util";
import { actionLogger } from "../../../store/actions/creators/auth";

let url = "";

export default (props) => {
  const [link, setLink] = useState("");
  const [integrationTypeId, setIntegrationTypeId] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setLink(props.route.params.link);
    if (link.charAt(0) === "f") {
      setLink("https://" + link);
    }
    url = link;
    setIntegrationTypeId(props.route.params.integrationId);
    dispatch(setWebViewOpen(true));
  }, [props.route.params]);

  useEffect(() => {
    if (link.charAt(0) === "f") {
      setLink("https://" + link);
    }
    url = link;
    if (link) actionLogger(true, "Web View Open", link);
  }, [link]);

  const syncEpic = (code, providerId) => {
    if (code && providerId) {
      linkEpic({ providerId, code }).then((resp) => {
        if (resp.statusCode === 0) {
          let linked = props.route.params.providers.find(
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

  const syncGeneric = (code, providerId) => {
    if (code && providerId) {
      linkGeneric({ providerId, code }).then((resp) => {
        if (resp.statusCode === 0) {
          let linked = props.route.params.providers.find(
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

  const startSync = (successIndicatorQueryStringParam, providerId) => {
    if (successIndicatorQueryStringParam && providerId) {
      checkLinkProvider({ providerId }).then((resp) => {
        if (resp.statusCode === 0) {
          let linked = props.route.params.providers.find(
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
  const onNavigationStateChange = (navState) => {
    if (url !== navState.url) {
      url = navState.url;
      actionLogger(true, "Web View", url);

      let successCode = getParameterByName("code", url);
      let successIndicatorQueryStringParam = getParameterByName("success", url);
      let issIndicatorQueryStringParam = getParameterByName("iss", url);

      if (successCode && integrationTypeId === 6) {
        syncEpic(successCode.toString(), props.route.params.providerID);
        actionLogger(true, "Web View Close", "");
        props.navigation.navigate("Providers", {
          successIndicatorQueryStringParam: true,
          providerID: props.route.params.providerID,
        });
      } else if (
        successCode &&
        successCode !== "None" &&
        integrationTypeId === 8
      ) {
        syncGeneric(successCode.toString(), props.route.params.providerID);
        actionLogger(true, "Web View Close", "");
        props.navigation.navigate("Providers", {
          successIndicatorQueryStringParam: true,
          providerID: props.route.params.providerID,
        });
      } else if (
        successIndicatorQueryStringParam &&
        issIndicatorQueryStringParam &&
        integrationTypeId == 1
      ) {
        startSync(
          successIndicatorQueryStringParam,
          props.route.params.providerID
        );
        actionLogger(true, "Web View Close", "");
        props.navigation.navigate("Providers", {
          successIndicatorQueryStringParam,
          providerID: props.route.params.providerID,
        });
      }
    }
  };

  const getParameterByName = (name, uri) => {
    if (!uri) uri = window.location;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(uri);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  return link == "" ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#1EB5FC" />
    </View>
  ) : (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={{ flex: 1 }}>
            <CloseIcon
              onPress={() => {
                actionLogger(true, "Web View Close", "");
                props.navigation.navigate("Providers");
              }}
            />
            <WebView
              source={{
                uri: link,
              }}
              onNavigationStateChange={onNavigationStateChange}
              mixedContentMode="always"
              startInLoadingState={true}
              bounces={false}
              // contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
            />
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "red",
    width: 30,
  },
  btn: {
    backgroundColor: "red",
  },
});
