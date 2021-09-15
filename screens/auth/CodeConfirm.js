import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { ThemeConsumer, Text, Button, Input } from "react-native-elements";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import CodeConfirm from "../../assets/images/code-confirm.svg";
import { confirmCode } from "../../store/actions/creators/auth";
import { fonts, theme, metrics } from "../../constants";
import { i18n } from "../../util";
import { connect } from "react-redux";
import { dispatch } from "../../store/configStore";
import { blockPage } from "../../store/actions/creators/UI";

const CELL_COUNT = 14;
const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
});

export default connect(mapStateToProps)((props) => {
  const [value, setValue] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [fieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const confirmCodeHdl = () => {
    setDisableBtn(true);
    dispatch(blockPage());
    let data = {
      userName: props.route.params.userName,
      code: value,
    };
    confirmCode(data, props).then(()=> setDisableBtn(false));
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
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  <CodeConfirm style={{ marginTop: 20 }} />
                  <Text style={styles.heading}>{i18n.t("user.recCode")}</Text>
                  <Text
                    style={{
                      color: "#BCBCBC",
                      width: "70%",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    {i18n.t("user.recCodeMsg")}
                  </Text>
                  <View
                    style={{
                      marginTop: 30,
                      width: metrics.vw * 95,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 85 * metrics.vw,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Input value={value} onChangeText={setValue} keyboardType="number-pad" />
                      {/* <CodeField
                        style
                        ref={ref}
                        {...fieldProps}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFiledRoot}
                        keyboardType="number-pad"
                        renderCell={({ index, symbol, isFocused }) => (
                          <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}
                          >
                            {symbol || (isFocused ? <Cursor /> : null)}
                          </Text>
                        )}
                      /> */}
                    </View>
                    <Button
                      title={i18n.t("user.confirmCode")}
                      disabled={value.length < CELL_COUNT || disableBtn}
                      containerStyle={{ marginTop: 40, width: "100%" }}
                      onPress={confirmCodeHdl}
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
  codeFiledRoot: {
    marginTop: 20,
  },
  cell: {
    width: 5 * metrics.vw,
    height: 42,
    lineHeight: 38,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#00000040",
    textAlign: "center",
    borderRadius: 5,
    marginHorizontal: 2,
  },
  focusCell: {
    borderColor: "#1EB5FC",
  },
  heading: {
    color: theme.colors.secondary,
    textAlign: "center",
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
    marginTop: 40,
    width: "70%",
  },
  scrollContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100 * metrics.vw,
    // height: 100 * metrics.vh,
  },
});
