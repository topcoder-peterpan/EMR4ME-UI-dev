import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { ThemeConsumer, Text, Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { Validations, i18n } from "../../util";
import { checkSignUpUser } from "../../store/actions/creators/auth";
import { connect, useDispatch } from "react-redux";
import { fonts, theme, metrics, StaticData } from "../../constants";
import FormInput from "./auxiliary/FormInput";
import DateTimePicker from "../../components/common/date-time-picker";
import { Dropdown } from "react-native-material-dropdown";
import { showAlert, blockPage } from "../../store/actions/creators/UI";
import { inBetweenDates } from "../../util/common";

const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
});
export default connect(mapStateToProps)((props) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  const initFormInputs = {
    username: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        {
          rule: Validations.alphaNumericEnglish,
          valid: false,
          key: "alphaNumericEnglish",
        },
        {
          rule: (val) => Validations.maxLength(val, 30),
          valid: false,
          key: "maxLength",
        },
      ],
      errors: [],
    },
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
        {
          rule: (val) => Validations.minLength(val, 8),
          valid: false,
          key: "minLength",
        },
        {
          rule: (val) => Validations.maxLength(val, 30),
          valid: false,
          key: "maxLength",
        },
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
    firstname: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        {
          rule: Validations.alphaNumericWithoutNumberEnglish,
          valid: false,
          key: "alphaNumericEnglish",
        },
        {
          rule: (val) => Validations.maxLength(val, 30),
          valid: false,
          key: "maxLength",
        },
      ],
      errors: [],
    },
    lastname: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        {
          rule: Validations.alphaNumericWithoutNumberEnglish,
          valid: false,
          key: "alphaNumericEnglish",
        },
        {
          rule: (val) => Validations.maxLength(val, 30),
          valid: false,
          key: "maxLength",
        },
      ],
      errors: [],
    },
    maiden_name: {
      value: "",
      valid: true,
      touched: true,
      validations: [
        {
          rule: Validations.alphaNumericWithoutNumberEnglish,
          valid: true,
          key: "alphaNumericEnglish",
        },
        {
          rule: (val) => Validations.maxLength(val, 30),
          valid: true,
          key: "maxLength",
        },
      ],
      errors: [],
    },
    phone: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        { rule: Validations.validPhone, valid: false, key: "validPhone" },
      ],
      errors: [],
    },
    // ssn: {
    //   value: "",
    //   valid: false,
    //   touched: false,
    //   validations: [
    //     { rule: Validations.required, valid: false, key: "required" },
    //     { rule: Validations.validNumber, valid: false, key: "validNumber" },
    //     { rule: (val) => Validations.maxLength(val, 20), valid: true, key: "maxLength" },
    //   ],
    //   errors: [],

    // },
    // gender: {
    //   value: "",
    //   valid: false,
    //   touched: false,
    //   validations: [
    //     { rule: Validations.required, valid: false, key: "required" },
    //   ],
    //   errors: [],
    //
    // },
    // mrn: {
    //   value: "",
    //   valid: true,
    //   touched: true,
    //   validations: [
    //     { rule: (val) => Validations.maxLength(val, 30), valid: true, key: "maxLength" },
    //     { rule: Validations.validNumber, valid: true, key: "validNumber" },
    //   ],
    //   errors: [],
    //
    // },
    // ethnic_group: {
    //   value: "",
    //   valid: false,
    //   touched: false,
    //   validations: [
    //     { rule: Validations.required, valid: false, key: "required" },
    //   ],
    //   errors: [],

    // },
    // maritalStatus: {
    //   value: "",
    //   valid: false,
    //   touched: false,
    //   validations: [
    //     { rule: Validations.required, valid: false, key: "required" },
    //   ],
    //   errors: [],

    // },
    mail: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        { rule: Validations.isEmail, valid: false, key: "isEmail" },
        {
          rule: (val) => Validations.maxLength(val, 30),
          valid: true,
          key: "maxLength",
        },
      ],
      errors: [],
    },
    city: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        {
          rule: Validations.alphaNumericSpaceEnglish,
          valid: false,
          key: "alphaNumericEnglish",
        },
        {
          rule: (val) => Validations.maxLength(val, 30),
          valid: false,
          key: "maxLength",
        },
      ],
      errors: [],
    },
    street: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        {
          rule: Validations.alphaNumericSpaceEnglishSpecial,
          valid: false,
          key: "alphaNumericEnglish",
        },
        {
          rule: (val) => Validations.maxLength(val, 50),
          valid: false,
          key: "maxLength",
        },
      ],
      errors: [],
    },
    state: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        {
          rule: Validations.alphaEnglish,
          valid: false,
          key: "alphaNumericEnglish",
        },
        {
          rule: (val) => Validations.maxLength(val, 2),
          valid: false,
          key: "maxLength",
        },
      ],
      errors: [],
    },
    postalcode: {
      value: "",
      valid: false,
      touched: false,
      validations: [
        { rule: Validations.required, valid: false, key: "required" },
        {
          rule: Validations.alphaNumericSpaceEnglishDash,
          valid: false,
          key: "alphaNumericEnglish",
        },
        {
          rule: (val) => Validations.maxLength(val, 10),
          valid: false,
          key: "maxLength",
        },
      ],
      errors: [],
    },
  };

  const [formValid, updateValidity] = useState(false);
  const [formInputs, setFormInputs] = useState(initFormInputs);

  const { isLoading } = props;

  const input = (value, fieldName, candidate) => {
    Validations.input(value, formInputs, fieldName, candidate, () => {
      setFormInputs({ ...formInputs });
      updateValidity(Object.keys(formInputs).every((o) => formInputs[o].valid));
    });
  };

  let maximumDate = new Date();
  let minimumDate = new Date();
  maximumDate.setFullYear(maximumDate.getFullYear() - 16);
  minimumDate.setFullYear(minimumDate.getFullYear() - 120);

  const initDate = moment.utc(maximumDate).subtract(1, "days").toDate();
  const [dob, setDob] = useState(initDate);
  const trySignUp = () => {
    if (!formValid) {
      if (inBetweenDates(minimumDate, maximumDate, dob)) {
        return dispatch(
          showAlert({
            msg: i18n.t("error.enterYourBirthDate"),
            type: "error",
            present: false,
            iconName: "warning",
          })
        );
      }
      let firstError = null;
      if (formInputs)
        Object.keys(formInputs).forEach((fieldName) => {
          const err =
            formInputs[fieldName].errors.length > 0
              ? formInputs[fieldName].errors[0].value
              : "";
          formInputs[fieldName].touched = true;
          if (err && !firstError) {
            firstError = err;
            return dispatch(
              showAlert({
                msg: fieldNameerr,
                type: "error",
                present: false,
                iconName: "warning",
              })
            );
          }
        });
      if (firstError) return;
      setFormInputs({ ...formInputs });
      dispatch(
        showAlert({
          msg: i18n.t("error.requiredData"),
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
      return;
    }
    let user = {
      username: formInputs.username.value.toLowerCase().trim(),
      email: formInputs.mail.value.toLowerCase(),
      mobile: formInputs.phone.value,
      password: formInputs.password.value,
      fname: formInputs.firstname.value,
      lname: formInputs.lastname.value,
      address: formInputs.street.value,
      state: formInputs.state.value,
      postal_code: formInputs.postalcode.value,
      city: formInputs.city.value,
      // ssn: formInputs.ssn.value,
      dob: dob,
      photoUrl: "",
      // ethnic_group: formInputs.ethnic_group.value,
      ethnic_group: null,
      // gender: formInputs.gender.value,
      // marital_status: formInputs.maritalStatus.value,
      marital_status: null,
      user_type: "patient",
      device_type: Platform.OS.toUpperCase(),
    };
    // if (formInputs.mrn.value)
    //   user.mrn = formInputs.mrn.value
    if (formInputs.maiden_name.value)
      user.maiden_name = formInputs.maiden_name.value;

    if (formValid) {
      dispatch(blockPage());
      checkSignUpUser({
        username: formInputs.username.value.toLowerCase().trim(),
        email: formInputs.mail.value.toLowerCase(),
        mobile: formInputs.phone.value,
      }).then((resp) => {
        if (resp.statusCode == 0) props.navigation.navigate("Terms", user);
        else if (resp && resp.message)
          dispatch(
            showAlert({
              msg: resp.message,
              type: "error",
              present: false,
              iconName: "warning",
            })
          );
      });
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
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
              <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <ScrollView
                  keyboardShouldPersistTaps="never"
                  contentContainerStyle={{ padding: 30 }}
                >
                  <View>
                    <FormInput
                      textContentType={"newPassword"}
                      selectTextOnFocus={true}
                      textContentType="oneTimeCode"
                      maxLength={30}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.username")}
                      iconName="user"
                      fieldName="username"
                      value={formInputs.username.value}
                      input={input}
                      trim={true}
                    />
                    <FormInput
                      textContentType={"newPassword"}
                      selectTextOnFocus={true}
                      secureTextEntry={true}
                      textContentType="oneTimeCode"
                      maxLength={30}
                      theme={theme}
                      change={() => {
                        if (formInputs.passwordConfirmation.value)
                          input(
                            formInputs.passwordConfirmation.value,
                            "passwordConfirmation",
                            "password"
                          );
                      }}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.password")}
                      iconName="lock"
                      fieldName="password"
                      value={formInputs.password.value}
                      input={input}
                    />
                    <FormInput
                      textContentType={"newPassword"}
                      selectTextOnFocus={true}
                      secureTextEntry={true}
                      textContentType="oneTimeCode"
                      maxLength={30}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.passwordConfirmation")}
                      iconName="lock"
                      fieldName="passwordConfirmation"
                      candidate={"password"}
                      value={formInputs.passwordConfirmation.value}
                      input={input}
                    />
                    <FormInput
                      maxLength={15}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.phone")}
                      keyboardType={"numeric"}
                      iconName="phone"
                      fieldName="phone"
                      value={formInputs.phone.value}
                      input={input}
                      trim={true}
                    />
                    <FormInput
                      maxLength={30}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.firstName")}
                      iconName="user"
                      fieldName="firstname"
                      value={formInputs.firstname.value}
                      input={input}
                    />
                    <FormInput
                      maxLength={30}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.lastName")}
                      iconName="user"
                      fieldName="lastname"
                      value={formInputs.lastname.value}
                      input={input}
                    />
                    <FormInput
                      maxLength={30}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.MName")}
                      iconName="user"
                      fieldName="maiden_name"
                      value={formInputs.maiden_name.value}
                      input={input}
                    />
                    {/* <FormInput theme={theme} formInputs={formInputs} placeholder={i18n.t('user.ssn')} keyboardType={'numeric'} iconName="address-card" fieldName="ssn" value={formInputs.ssn.value} input={input} /> */}
                    {/* <FormInput theme={theme} formInputs={formInputs} placeholder={i18n.t('user.mrn')} iconName="medkit" fieldName="mrn" value={formInputs.mrn.value} input={input} /> */}

                    {/* <Dropdown
                    error={formInputs.gender.errors.length > 0 ? formInputs.gender.errors[0].value : (!formInputs.gender.valid && formInputs.gender.touched ? '*' : '')}
                    onChangeText={(value, index, data) => {
                      //updateValidityOfMaiden(value, formInputs.maritalStatus.value);
                      input(value, 'gender');
                    }}
                    text
                    overlayStyle={{ backgroundColor: '#00000055' }}
                    label={i18n.t('health.asthma.gender')}
                    data={StaticData.gender}
                    labelExtractor={({ value }) => value}
                    valueExtractor={({ key }) => key}
                    value={formInputs.gender.value}
                  /> */}
                    <FormInput
                      keyboardType={"email-address"}
                      maxLength={30}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.mail")}
                      iconName="envelope"
                      fieldName="mail"
                      value={formInputs.mail.value}
                      input={input}
                      trim={true}
                    />
                    <FormInput
                      maxLength={50}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.street")}
                      iconName="map-marker"
                      fieldName="street"
                      value={formInputs.street.value}
                      input={input}
                    />
                    <View style={{ flexDirection: "row" }}>
                      <FormInput
                        maxLength={30}
                        theme={theme}
                        containerStyle={{ width: "50%" }}
                        formInputs={formInputs}
                        placeholder={i18n.t("user.city")}
                        iconName="map-marker"
                        fieldName="city"
                        value={formInputs.city.value}
                        input={input}
                      />
                      <FormInput
                        maxLength={2}
                        theme={theme}
                        containerStyle={{ width: "50%" }}
                        formInputs={formInputs}
                        placeholder={i18n.t("user.state")}
                        iconName="map-marker"
                        fieldName="state"
                        value={formInputs.state.value}
                        input={input}
                      />
                    </View>
                    <FormInput
                      maxLength={10}
                      blurOnSubmit={true}
                      theme={theme}
                      formInputs={formInputs}
                      placeholder={i18n.t("user.zip")}
                      iconName="map-marker"
                      keyboardType={"numbers-and-punctuation"}
                      fieldName="postalcode"
                      value={formInputs.postalcode.value}
                      input={input}
                    />

                    {/* <Dropdown
                      onPress={dismissKeyboard}
                      error={formInputs.maritalStatus.errors.length > 0 ? formInputs.maritalStatus.errors[0].value : (!formInputs.maritalStatus.valid && formInputs.maritalStatus.touched ? '' : '')}
                      onChangeText={(value, index, data) => {
                        //updateValidityOfMaiden(formInputs.gender.value, value);
                        input(value, 'maritalStatus');
                      }}
                      text
                      overlayStyle={{ backgroundColor: '#00000055' }}
                      label={i18n.t('user.maritalStatus')}
                      data={StaticData.maritalStatus}
                      labelExtractor={({ value }) => value}
                      valueExtractor={({ key }) => key}
                      value={formInputs.maritalStatus.value}
                    />
                    <Dropdown
                      onPress={dismissKeyboard}
                      error={formInputs.ethnic_group.errors.length > 0 ? formInputs.ethnic_group.errors[0].value : (!formInputs.ethnic_group.valid && formInputs.ethnic_group.touched ? '' : '')}
                      onChangeText={(value, index, data) => {
                        input(value, 'ethnic_group');
                      }}
                      text
                      itemCount={4.4}
                      overlayStyle={{ backgroundColor: '#00000055' }}
                      label={i18n.t('user.ethnic_group')}
                      data={StaticData.ethnicGroups}

                      labelExtractor={({ value }) => value}
                      valueExtractor={({ key }) => key}
                      value={formInputs.ethnic_group.value}
                    /> */}

                    <DateTimePicker
                      label={i18n.t("user.dob")}
                      value={dob}
                      defaultNull
                      hasSelected={setHasSelected}
                      setValue={setDob}
                      maxDate={maximumDate}
                      minDate={minimumDate}
                      flag
                    />
                    <Button
                      disabled={!(formValid && hasSelected)}
                      title={i18n.t("user.signUp")}
                      containerStyle={{ marginTop: 40 }}
                      onPress={trySignUp}
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  forgetPass: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  heading: {
    color: theme.colors.secondary,
    textAlign: "center",
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
    marginBottom: 40,
  },
});
