import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  ThemeConsumer,
  Text,
  Button,
  Input,
  Icon,
} from "react-native-elements";
import Lock from "../../assets/images/lock.svg";
import { i18n, Validations } from "../../util";
import { fonts, theme, metrics } from "../../constants";
import { resetPassword } from "../../store/actions/creators/auth";
import { connect, useDispatch } from "react-redux";
import { blockPage, showAlert } from "../../store/actions/creators/UI";

const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
});

export default connect(mapStateToProps)((props) => {
  const [username, setUsername] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const dispatch = useDispatch();

  const resetPasswordClicked = () => {
    //props.navigation.navigate('CodeConfirm', { email: email.trim().toLowerCase() });
    setDisableBtn(true);
    dispatch(blockPage());
    if (
      username &&
      Validations.required(username) &&
      Validations.maxLength(username, 30)
    ) {
      resetPassword(
        { userName: username.trim().toLowerCase(), sendingOption: "1" },
        props
      ).then(() => {
        setUsername("");
        setDisableBtn(false);
      });
    } else {
      if (!Validations.required(username))
        dispatch(
          showAlert({
            msg: i18n.t("error.required"),
            type: "error",
            present: false,
            iconName: "warning",
          })
        );
      else
        dispatch(
          showAlert({
            msg: i18n.t("error.validUserNameOrMail"),
            type: "error",
            present: false,
            iconName: "warning",
          })
        );
    }
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
            <KeyboardAvoidingView
              enabled
              keyboardVerticalOffset={100}
              behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollContainer}
                >
                  <Lock style={{ marginTop: 20 }} />
                  <Text style={styles.heading}>
                    {i18n.t("user.resetPassword")}
                  </Text>
                  <Text
                    style={{
                      color: "#BCBCBC",
                      width: "70%",
                      textAlign: "center",
                    }}
                  >
                    {i18n.t("user.enterUrUsernameOrMail")}
                  </Text>
                  <View style={{ width: "85%", marginTop: 30 }}>
                    <Input
                      autoCorrect={false}
                      autoCompleteType="off"
                      placeholderTextColor="#d3d3d3"
                      placeholder={i18n.t("user.usernameOrEmail")}
                      leftIcon={
                        <Icon
                          name="user"
                          type="font-awesome"
                          size={20}
                          color={theme.colors.secondary}
                        />
                      }
                      value={username}
                      onChangeText={(value) => {
                        setUsername(value ? value.trim() : "");
                      }}
                    />

                    <Button
                      title={i18n.t("user.sendCode")}
                      containerStyle={{ marginTop: 40 }}
                      onPress={resetPasswordClicked}
                      disabled={disableBtn}
                    />
                  </View>
                </ScrollView>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  heading: {
    color: theme.colors.secondary,
    textAlign: "center",
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
    marginTop: 40,
  },
  scrollContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100 * metrics.vw,
    // height: 100 * metrics.vh,
  },
});
