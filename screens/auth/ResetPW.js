import React, { useState } from "react";
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
import Lock from "../../assets/images/unlock.svg";
import { changePassword } from "../../store/actions/creators/auth";
import { Validations, i18n } from "../../util";
import { fonts, theme, metrics } from "../../constants";
import { connect } from "react-redux";
import { dispatch } from "../../store/configStore";
import { blockPage } from "../../store/actions/creators/UI";

const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
});
export default connect(mapStateToProps)((props) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const { userName } = props.route.params;
  const initFormInputs = {
    password: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        { rule: Validations.lowercase, valid: false, key: "lowercase" },
        { rule: Validations.uppercase, valid: false, key: "uppercase" },
        { rule: Validations.digits, valid: false, key: "digits" },
        { rule: Validations.special, valid: false, key: "special" },
        { rule: Validations.passwordRegex, valid: false, key: "passwordRegex" },
      ],
      errors: [],
    },
    passwordConfirmation: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        { rule: Validations.exactMatch, valid: false, key: "exactMatch" },
      ],
      errors: [],
    },
  };

  const [formValid, updateValidity] = useState(false);
  const [formInputs, setFormInputs] = useState(initFormInputs);

  const input = (value, fieldName, candidate) => {
    Validations.input(value, formInputs, fieldName, candidate, () => {
      setFormInputs({ ...formInputs });
      updateValidity(Object.keys(formInputs).every((o) => formInputs[o].valid));
    });
  };

  const changePasswordHdl = () => {
    setDisableBtn(true);
    dispatch(blockPage());
    changePassword(
      {
        sendingOption: "1",
        userName,
        password: formInputs.password.value,
      },
      props
    ).then(() => setDisableBtn(false));
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
                    {i18n.t("user.newPassword")}
                  </Text>
                  <Text
                    style={{
                      color: "#BCBCBC",
                      width: "70%",
                      textAlign: "center",
                    }}
                  >
                    {i18n.t("user.entrNwPswrd")}
                  </Text>
                  <View style={{ width: "85%", marginTop: 30 }}>
                    <Input
                      autoCorrect={false}
                      autoCompleteType="off"
                      errorMessage={
                        formInputs.password.errors.length > 0
                          ? formInputs.password.errors[0].value
                          : ""
                      }
                      placeholder={i18n.t("user.password")}
                      secureTextEntry={true}
                      placeholderTextColor="#d3d3d3"
                      leftIcon={
                        <Icon
                          name="lock"
                          size={20}
                          color={theme.colors.secondary}
                        />
                      }
                      value={formInputs.password.value}
                      onChangeText={(value) => {
                        input(value, "password");
                        if (formInputs.passwordConfirmation.value)
                          input(
                            formInputs.passwordConfirmation.value,
                            "passwordConfirmation",
                            "password"
                          );
                      }}
                    />
                    <Input
                      autoCorrect={false}
                      autoCompleteType="off"
                      errorMessage={
                        formInputs.passwordConfirmation.errors.length > 0
                          ? formInputs.passwordConfirmation.errors[0].value
                          : ""
                      }
                      placeholder={i18n.t("user.passwordConfirmation")}
                      placeholderTextColor="#d3d3d3"
                      secureTextEntry={true}
                      leftIcon={
                        <Icon
                          name="lock"
                          size={20}
                          color={theme.colors.secondary}
                        />
                      }
                      value={formInputs.passwordConfirmation.value}
                      onChangeText={(value) =>
                        input(value, "passwordConfirmation", "password")
                      }
                    />
                    <Button
                      disabled={!formValid || disableBtn}
                      title={i18n.t("user.resetPassword")}
                      containerStyle={{ marginTop: 40 }}
                      onPress={changePasswordHdl}
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
