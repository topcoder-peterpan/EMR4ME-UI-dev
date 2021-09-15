import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { ThemeConsumer, Text, Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import { i18n } from "./../../util";
import { fonts, theme, metrics } from "./../../constants";

import { AuthContext } from "../../components/auth/AuthContext";
import { Validations } from "../../util";
import { connect, useDispatch } from "react-redux";
import { blockPage } from "../../store/actions/creators/UI";
import { Platform } from "react-native";

const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
});
export default connect(mapStateToProps)((props) => {
  const dispatch = useDispatch();
  const initFormInputs = {
    usernameOrEmail: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
      ],
    },
    password: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
      ],
    },
  };

  const [formValid, updateValidity] = useState(false);
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const [formInputs, setFormInputs] = useState(initFormInputs);

  const { signIn } = useContext(AuthContext);

  const { isLoading } = props;

  const input = (value, fieldName) => {
    let formInput = formInputs[fieldName];
    formInput.value = typeof value === "string" ? value.trim() : value;
    formInput.touched = true;
    formInput.validations.forEach((element) => {
      element.valid = element.rule(formInput.value);
    });
    formInput.valid = formInput.validations.every((o) => o.valid);
    setFormInputs({ ...formInputs });
    updateValidity(Object.keys(formInputs).every((o) => formInputs[o].valid));
  };

  const tryLogin = async () => {
    // if (validateForm()) {
    dispatch(blockPage());
    signIn({
      username: formInputs.usernameOrEmail.value.toLowerCase().trim(),
      password: formInputs.password.value,
      device_type: Platform.OS.toUpperCase(),
    });
    // }
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
                  <View style={{ width: "85%" }}>
                    <Input
                      autoCorrect={false}
                      autoCompleteType="off"
                      placeholderTextColor="#d3d3d3"
                      placeholder={i18n.t("user.usernameOrEmail")}
                      leftIcon={
                        <Icon
                          name="user"
                          size={20}
                          color={theme.colors.secondary}
                        />
                      }
                      value={formInputs.usernameOrEmail.value}
                      onChangeText={(value) => {
                        input(value, "usernameOrEmail");
                      }}
                    />
                    <Input
                      autoCorrect={false}
                      autoCompleteType="off"
                      placeholderTextColor="#d3d3d3"
                      placeholder={i18n.t("user.password")}
                      secureTextEntry={!passwordVisible}
                      leftIcon={
                        <Icon
                          name="lock"
                          size={20}
                          color={theme.colors.secondary}
                        />
                      }
                      rightIcon={
                        <Icon
                          name={!passwordVisible ? "eye" : "eye-slash"}
                          onPress={() =>
                            setPasswordVisibility(!passwordVisible)
                          }
                          size={20}
                          color={theme.colors.secondary}
                        />
                      }
                      value={formInputs.password.value}
                      onChangeText={(value) => {
                        input(value, "password");
                      }}
                    />
                    <Button
                      disabled={!formValid}
                      title={i18n.t("user.login")}
                      containerStyle={{ marginTop: 40 }}
                      onPress={tryLogin}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                  >
                    <Text>{i18n.t("user.forgotPassword")} </Text>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate("ForgotPW")}
                    >
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontFamily: fonts.MontserratBold,
                        }}
                      >
                        {i18n.t("user.clickHere")}
                      </Text>
                    </TouchableOpacity>
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
  activityContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: theme.colors.secondary,
    textAlign: "center",
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
    marginBottom: 40,
  },
  scrollContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100 * metrics.vw,
    height: 80 * metrics.vh,
  },
});
