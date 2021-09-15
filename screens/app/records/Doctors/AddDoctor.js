import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import { ThemeConsumer, Button, Avatar } from "react-native-elements";
import FIcon from "react-native-vector-icons/FontAwesome";

import { connect, useDispatch } from "react-redux";

import { Validations } from "../../../../util";
import FormInput from "../../../auth/auxiliary/FormInput";
import { i18n } from "../../../../util";
import { fonts, theme, metrics, StaticData } from "../../../../constants";
import {
  addDoctor,
  deleteDoctor,
  editDoctor,
  getContacts,
} from "../../../../store/actions/creators/doctors";
import { useNavigation } from "@react-navigation/native";
import {
  endLoading,
  hideConfirmDialogue,
  showAlert,
  showConfirmDialogue,
  startLoading,
} from "../../../../store/actions/creators/UI";
import ButtonAttributes from "../../../../components/common/ButtonAttributes";

const Icon = (props) => {
  return (
    <FIcon
      {...props}
      color={props.isLoading ? theme.colors.disabled : props.color}
      onPress={() => (props.isLoading ? null : props.onPress())}
    />
  );
};
const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
});
export default connect(mapStateToProps)((props) => {
  const dispatch = useDispatch();
  const doctor = props.route ? props.route.params : {};
  if (doctor && doctor.phone)
    doctor.phone = doctor.phone
      .split(",")
      .map((d) => d.substring(2))
      .join(",");
  const isEditMode = doctor ? doctor.id : null;
  const navigation = useNavigation();

  useEffect(() => {
    return () => {
      hideConfirmDialogue();
    };
  }, []);

  const showMaxError = (mail) => {
    if (mail)
      dispatch(
        showAlert({
          msg: i18n.t("error.maxMailLng") + StaticData.MAX_MAIL_CELLS_LENGTH,
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    else
      dispatch(
        showAlert({
          msg: i18n.t("error.maxPhoneLng") + StaticData.MAX_PHONE_CELLS_LENGTH,
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
  };
  const phoneEntry = {
    value: "",
    valid: false,
    touched: false,
    validations: [
      { rule: Validations.required, valid: false, key: "required" },
      { rule: Validations.validPhone, valid: false, key: "validPhone" },
    ],
    errors: [],
  };
  const mailEntry = {
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
  };
  const initFormInputs = {
    phones: [phoneEntry],
    emails: [mailEntry],
    firstname: {
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
    lastname: {
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
  };

  const [formValid, updateValidity] = useState(false);
  const [formInputs, setFormInputs] = useState(initFormInputs);

  const { isLoading } = props;
  const updateFormValidity = () => {
    let valid = true;
    if (!formInputs.firstname.valid) valid = false;
    if (!formInputs.lastname.valid) valid = false;
    if (formInputs.phones.length === 0 && formInputs.emails.length === 0)
      valid = false;
    else if (formInputs.phones.length > 0 || formInputs.emails.length > 0) {
      let onePhoneValid = formInputs.phones.findIndex((e) => e.valid) > -1;
      let oneEmailValid = formInputs.emails.findIndex((e) => e.valid) > -1;
      let phonesValid = formInputs.phones.every((e) => !e.value || e.valid);
      let emailsValid = formInputs.emails.every((e) => !e.value || e.valid);
      if (!onePhoneValid && !oneEmailValid) valid = false;
      if (!phonesValid || !emailsValid) {
        //not valid entry
        valid = false;
      }
    }
    updateValidity(valid);
  };
  const addImportedInputs = (fieldName, values) => {
    //remove the first empty field if there are new values
    // if (values.length > 0 && formInputs[fieldName].length === 1 && !formInputs[fieldName][0].value)
    //     formInputs[fieldName] = formInputs[fieldName].filter(o => o.value);
    formInputs[fieldName] = [];

    if (fieldName === "emails") {
      if (values.length === 0) formInputs[fieldName].push({ ...mailEntry });
      values.forEach((mail) => {
        if (formInputs[fieldName].length < StaticData.MAX_MAIL_CELLS_LENGTH)
          formInputs[fieldName].push({ ...mailEntry, value: mail.address });
        else showMaxError(true);
      });
    }

    if (fieldName === "phones") {
      if (values.length === 0) formInputs[fieldName].push({ ...phoneEntry });
      values.forEach((val) => {
        if (formInputs[fieldName].length < StaticData.MAX_PHONE_CELLS_LENGTH)
          formInputs[fieldName].push({ ...phoneEntry, value: val.number });
        else showMaxError();
      });
    }
    setFormInputs({ ...formInputs });
    setTimeout(() => {
      formInputs["emails"].forEach((mail, i) => {
        input(mail.value, i, "emails");
      });
      formInputs["phones"].forEach((phone, i) => {
        input(phone.value, i, "phones");
      });
    }, 0);
  };
  const removeInput = (fieldName, index) => {
    if (formInputs[fieldName].length > 1) {
      formInputs[fieldName].splice(index, 1);
      setFormInputs({ ...formInputs });
      updateFormValidity();
    }
  };
  const addInput = (fieldName) => {
    if (
      fieldName === "phones" &&
      formInputs[fieldName].length >= StaticData.MAX_PHONE_CELLS_LENGTH
    ) {
      showMaxError();
      return;
    } else if (
      fieldName === "emails" &&
      formInputs[fieldName].length >= StaticData.MAX_MAIL_CELLS_LENGTH
    ) {
      showMaxError(true);
      return;
    }

    if (
      fieldName === "phones" &&
      formInputs["phones"].every((e) => e.valid && e.value)
    ) {
      formInputs[fieldName].push({ ...phoneEntry });
    } else if (
      fieldName === "emails" &&
      formInputs["emails"].every((e) => e.valid && e.value)
    ) {
      formInputs[fieldName].push({ ...mailEntry });
    }
    setFormInputs({ ...formInputs });
    updateFormValidity();
  };
  const input = (value, fieldName, arrayName) => {
    Validations.input(
      value,
      formInputs,
      fieldName,
      null,
      () => {
        setFormInputs({ ...formInputs });
        updateFormValidity();
      },
      arrayName
    );
  };
  const noChages = () => {
    if (isEditMode && doctor && doctor.id) {
      const drPhones = doctor.phone.split(",");
      const phones = formInputs.phones.map((o) => o.value);
      const drMails = doctor.email.split(",");
      const mails = formInputs.emails.map((o) => o.value);
      return (
        doctor.fname == formInputs.firstname.value &&
        doctor.lname == formInputs.lastname.value &&
        phones.every(
          (element) => drPhones.findIndex((o) => o == element) > -1
        ) &&
        drPhones.every(
          (element) => phones.findIndex((o) => o == element) > -1
        ) &&
        phones.length === drPhones.length &&
        mails.length === drMails.length &&
        mails.every((element) => drMails.findIndex((o) => o == element) > -1) &&
        drMails.every((element) => mails.findIndex((o) => o == element) > -1)
      );
    }
    return false;
  };

  const submit = async () => {
    let noRedundunt = false;
    formInputs.emails.forEach((element, i) => {
      if (
        !formInputs.emails.every(
          (o, index) => i === index || o.value !== element.value
        )
      ) {
        noRedundunt = true;
      }
    });
    if (noRedundunt) {
      dispatch(
        showAlert({
          msg: i18n.t("error.redEmail"),
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
      return;
    }
    formInputs.phones.forEach((element, i) => {
      if (
        !formInputs.phones.every(
          (o, index) => i === index || o.value !== element.value
        )
      ) {
        noRedundunt = true;
      }
    });
    if (noRedundunt) {
      dispatch(
        showAlert({
          msg: i18n.t("error.redPhone"),
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
      return;
    }

    if (
      formInputs.phones.filter((o) => o.value && o.valid).length === 0 &&
      formInputs.emails.filter((o) => o.value && o.valid).length === 0
    )
      dispatch(
        showAlert({
          msg: i18n.t("error.mstSlctMailOrPhone"),
          type: "error",
          present: false,
          iconName: "warning",
        })
      );
    else {
      let doctorData = {
        email: formInputs.emails.map((o) => o.value),
        phone: formInputs.phones.filter(p => p.value).map((o) => "+1" + o.value),
        fname: formInputs.firstname.value,
        lname: formInputs.lastname.value,
      };

      if (doctor && doctor.id) {
        doctorData.id = doctor.id;
        editDoctor(doctorData).then((response) => {
          if (response.statusCode == 0) {
            navigation.navigate("ShareRecords", { added: 1 });
            dispatch(
              showAlert({
                msg: i18n.t("records.shareRecords.editSuccess"),
                type: "info",
                present: false,
                iconName: "check",
              })
            );
          } else if (response && response.statusMessage)
            dispatch(
              showAlert({
                msg: response.statusMessage,
                type: "error",
                present: false,
                iconName: "warning",
              })
            );
        });
      } else
        addDoctor(doctorData).then((response) => {
          if (response.statusCode == 0) {
            navigation.navigate("ShareRecords", { updated: 1 });
            dispatch(
              showAlert({
                msg: "Doctor " + i18n.t("common.added"),
                type: "info",
                present: false,
                iconName: "check",
              })
            );
          } else if (response && response.statusMessage)
            dispatch(
              showAlert({
                msg: response.statusMessage,
                type: "error",
                present: false,
                iconName: "warning",
              })
            );
        });
    }
  };

  useEffect(() => {
    if (doctor && doctor.id) {
      if (doctor.phone)
        addImportedInputs(
          "phones",
          doctor.phone.split(",").map((o) => ({ number: o }))
        );
      if (doctor.email)
        addImportedInputs(
          "emails",
          doctor.email.split(",").map((o) => ({ address: o }))
        );
      input(doctor.fname, "firstname");
      input(doctor.lname, "lastname");
    }
  }, [doctor]);

  const deleteDoctorHandler = () => {
    deleteDoctor(doctor).then((response) => {
      if (response.statusCode == 0) {
        navigation.navigate("ShareRecords", { deleted: 1 });
        dispatch(
          showAlert({
            msg: i18n.t("common.deleted"),
            type: "success",
            present: false,
            iconName: "check",
          })
        );
      }
    });
  };
  const removeDoctor = () => {
    dispatch(
      showConfirmDialogue({
        msg: i18n.t("records.shareRecords.confirmDelete"),
        title: i18n.t("records.shareRecords.deleteTitle"),
        leftButton: new ButtonAttributes(
          i18n.t("records.shareRecords.delete"),
          deleteDoctorHandler,
          theme.colors.danger
        ),
      })
    );
  };
  const pickContacts = async () => {
    dispatch(startLoading());
    const contacts = await getContacts();
    dispatch(endLoading());
    if (contacts) {
      addImportedInputs("phones", contacts.phones);
      addImportedInputs("emails", contacts.emails);
      input(contacts.givenName, "firstname");
      input(contacts.familyName, "lastname");
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
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        padding: 10,
                      }}
                    >
                      <View>
                        <Button
                          buttonStyle={styles.pickContactBtn}
                          titleStyle={{ fontSize: 12 }}
                          onPress={() => pickContacts()}
                          title={" Pick Contact"}
                          icon={
                            <Icon
                              isLoading={isLoading}
                              name="address-book"
                              size={24}
                              color={theme.colors.white}
                            />
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View
                        style={{ flexDirection: "row", width: 78 * metrics.vw }}
                      >
                        <View
                          style={{
                            marginVertical: 25,
                            width: 8 * metrics.vw,
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              marginVertical: 4,
                              marginHorizontal: 4,
                            }}
                          >
                            <Icon
                              isLoading={isLoading}
                              name="user"
                              size={20}
                              color={theme.colors.secondary}
                            />
                          </View>
                        </View>
                        <FormInput
                          maxLength={15}
                          theme={theme}
                          formInputs={formInputs}
                          placeholder={i18n.t("user.firstName")}
                          //iconName="user"
                          fieldName="firstname"
                          value={formInputs.firstname.value}
                          input={input}
                        />
                      </View>
                      <View
                        style={{ flexDirection: "row", width: 78 * metrics.vw }}
                      >
                        <View
                          style={{
                            marginVertical: 25,
                            width: 8 * metrics.vw,
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              marginVertical: 4,
                              marginHorizontal: 4,
                            }}
                          >
                            <Icon
                              isLoading={isLoading}
                              name="user"
                              size={20}
                              color={theme.colors.secondary}
                            />
                          </View>
                        </View>
                        <FormInput
                          maxLength={15}
                          theme={theme}
                          formInputs={formInputs}
                          placeholder={i18n.t("user.lastName")}
                          //iconName="user"
                          fieldName="lastname"
                          value={formInputs.lastname.value}
                          input={input}
                        />
                      </View>
                      <View style={{ width: 90 * metrics.vw }}>
                        {formInputs["emails"].map((o, i) => (
                          <View
                            key={i.toString()}
                            style={{
                              width: 72 * metrics.vw,
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {o.valid && formInputs["emails"].length > 1 ? (
                              <View
                                style={{
                                  marginVertical: 20,
                                  width: 8 * metrics.vw,
                                }}
                              >
                                <Icon
                                  isLoading={isLoading}
                                  onPress={() => removeInput("emails", i)}
                                  name="remove"
                                  size={25}
                                  color={theme.colors.error}
                                />
                              </View>
                            ) : null}
                            <View
                              style={{
                                marginVertical: 25,
                                width: 8 * metrics.vw,
                                flexDirection: "row",
                              }}
                            >
                              <View
                                style={{
                                  marginVertical: 4,
                                  marginHorizontal: 4,
                                }}
                              >
                                <Icon
                                  isLoading={isLoading}
                                  name="envelope"
                                  size={20}
                                  color={theme.colors.secondary}
                                />
                              </View>
                            </View>
                            <FormInput
                              noReqMsg={true}
                              maxLength={30}
                              theme={theme}
                              formInputs={formInputs}
                              placeholder={i18n.t("user.mail")}
                              //iconName="envelope"
                              arrayName="emails"
                              fieldName={i}
                              value={o.value}
                              keyboardType={"email-address"}
                              input={input}
                              trim={true}
                            />
                          </View>
                        ))}
                        {formInputs["emails"].length <
                          StaticData.MAX_MAIL_CELLS_LENGTH &&
                        formInputs["emails"].every(
                          (e) => e.valid && e.value
                        ) ? (
                          <Icon
                            isLoading={isLoading}
                            style={{ position: "absolute", right: 20, top: 25 }}
                            onPress={() => addInput("emails")}
                            name="plus"
                            size={20}
                            color={theme.colors.secondary}
                          />
                        ) : null}
                      </View>
                      <View style={{ width: 90 * metrics.vw }}>
                        {formInputs["phones"].map((o, i) => (
                          <View
                            key={i.toString()}
                            style={{
                              width: 56 * metrics.vw,
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {o.valid && formInputs["phones"].length > 1 ? (
                              <View
                                style={{
                                  marginVertical: 25,
                                  width: 8 * metrics.vw,
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    marginHorizontal: 4,
                                  }}
                                >
                                  <Icon
                                    isLoading={isLoading}
                                    onPress={() => removeInput("phones", i)}
                                    name="remove"
                                    size={25}
                                    color={theme.colors.error}
                                  />
                                </View>
                              </View>
                            ) : null}
                            <View
                              style={{
                                marginVertical: 25,
                                width: 16 * metrics.vw,
                                flexDirection: "row",
                              }}
                            >
                              <View
                                style={{
                                  marginVertical: 4,
                                  marginHorizontal: 8,
                                }}
                              >
                                <Icon
                                  isLoading={isLoading}
                                  name="phone"
                                  size={20}
                                  color={theme.colors.secondary}
                                />
                              </View>
                              <View
                                style={{
                                  width: 8 * metrics.vw,
                                  marginLeft: 8,
                                }}
                              >
                                <Text style={styles.phonePrefix}>+1</Text>
                              </View>
                            </View>

                            <FormInput
                              noReqMsg={true}
                              maxLength={15}
                              theme={theme}
                              formInputs={formInputs}
                              placeholder={i18n.t("user.phone")}
                              keyboardType={"numbers-and-punctuation"}
                              arrayName="phones"
                              //iconName="phone"
                              fieldName={i}
                              value={o.value}
                              input={input}
                              trim={true}
                            />
                          </View>
                        ))}
                        {formInputs["phones"].length <
                          StaticData.MAX_PHONE_CELLS_LENGTH &&
                        formInputs["phones"].every(
                          (e) => e.valid && e.value
                        ) ? (
                          <Icon
                            isLoading={isLoading}
                            style={{ position: "absolute", right: 20, top: 25 }}
                            onPress={() => addInput("phones")}
                            name="plus"
                            size={20}
                            color={theme.colors.secondary}
                          />
                        ) : null}
                      </View>
                      <Button
                        disabled={!formValid || isLoading || noChages()}
                        title={i18n.t(
                          isEditMode ? "common.update" : "common.add"
                        )}
                        containerStyle={{ marginTop: 40 }}
                        onPress={submit}
                      />
                      {isEditMode ? (
                        <Button
                          disabled={isLoading}
                          title={i18n.t("common.delete")}
                          containerStyle={{ marginTop: 10 }}
                          buttonStyle={styles.button}
                          titleStyle={styles.btnTitle}
                          onPress={removeDoctor}
                        />
                      ) : null}
                    </View>
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
  avatarContainer: {
    borderWidth: 4,
    borderColor: theme.colors.success,
    elevation: 11,
    width: 95,
    height: 95,
    borderRadius: 50,
    overflow: "hidden",
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
  button: {
    backgroundColor: "red",
  },
  btnTitle: {
    fontSize: 18,
    color: "white",
    fontFamily: fonts.MontserratBold,
  },
  pickContactBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scrollContainer: { padding: 30 },
  phonePrefix: {
    fontSize: 16,
    color: "grey",
  },
});
