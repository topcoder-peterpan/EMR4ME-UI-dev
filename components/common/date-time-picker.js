import React, { useEffect, useState } from "react";
import { Keyboard } from 'react-native';
import { Text, Input } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

import { View, TouchableOpacity, Modal, Platform, StyleSheet } from "react-native";
import { i18n } from "../../util";
import { theme, metrics } from "../../constants";
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { inBetweenDates } from "../../util/common";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


export default (props) => {
    useEffect(() => {
        Keyboard.dismiss();
    }, [])
    const { label, value, maxDate, minDate, setValue, defaultNull, flag, hasSelected } = props;
    const [initValue, setInitValue] = useState(value);
    const inBetween = inBetweenDates(minDate, maxDate, value);
    const [visible, setVisiblity] = useState(false);
    const [outOfRange, setOutOfRange] = useState(maxDate && minDate ? !inBetween : false);
    const [dobText, setDobText] = useState(defaultNull ? undefined : (value));

    const onChange = (event, selectedDate) => {
        setVisiblity(Platform.OS === 'ios');
        let newDate = new Date(selectedDate);
        newDate.setHours(9);
        let UTC = moment.utc(newDate);
        let local = moment(UTC).local();
        const currentDate = local || value;
        if (inBetweenDates(minDate, maxDate, currentDate)) {
            setValue(new Date(currentDate));
            setDobText(new Date(currentDate));
            if (hasSelected)
                hasSelected(true);
            setOutOfRange(false);
        } else {
            if (Platform.OS === 'ios') {
                setValue(new Date(currentDate));
                setDobText(new Date(currentDate));
                setOutOfRange(maxDate && minDate ? true : false)
            }
        }
    };

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    Keyboard.dismiss();
                    setVisiblity(true);
                }}>
                <View>

                    <Input
                        autoCorrect={false}
                        autoCompleteType="off"
                        onTouchEnd={() => {
                            Keyboard.dismiss();
                            setVisiblity(true);
                        }}
                        placeholderTextColor="#d3d3d3"
                        placeholder={label}
                        leftIcon={<Icon name="calendar" size={20} color={theme.colors.secondary} />}
                        editable={false}
                        value={dobText ? moment.utc(dobText).format('L') : ''}
                    />
                </View>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
                <Modal
                    animationType="fade"
                    transparent
                    visible={visible}
                    presentationStyle="overFullScreen"
                    onDismiss={() => setVisiblity(false)}
                    onRequestClose={() => setVisiblity(false)}
                >
                    <View style={styles.iosModalContainer}>
                        <View
                            style={styles.iosPickerContainer}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableWithoutFeedback style={styles.buttonReset} onPress={() => { setValue(initValue); onChange(null, initValue); }}>
                                    <Text style={styles.buttonResetText}>{i18n.t('common.reset')}</Text>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback style={styles.button} onPress={() => { if (!outOfRange) { onChange(null, value, true); setVisiblity(false) } }}>
                                    <Text style={styles.buttonText}>{i18n.t('common.done')}</Text>
                                </TouchableWithoutFeedback>
                            </View>

                            {outOfRange ? <View style={{ flexDirection: 'row', justifyContent: 'center' }}><Text style={styles.error}>{i18n.t("common.outofrange")}</Text></View> : null}
                            <DateTimePicker
                                style={{ width: '100%', backgroundColor: 'white', marginTop: 15 }}
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                display="calendar"
                                // minimumDate={minDate}
                                maximumDate={maxDate}
                                value={value}
                                mode={'date'}
                                display="default"
                                textColor={'black'}
                                onChange={onChange}
                            />
                        </View>
                    </View>
                </Modal>
            )
            }
            {visible && (
                Platform.OS === 'android' && (
                    <View>
                        <DateTimePicker
                            style={{ width: '100%' }}
                            testID="dateTimePicker"
                            timeZoneOffsetInMinutes={0}
                            display="calendar"
                            minimumDate={flag ? moment(minDate).add(1, 'days').toDate() : minDate}
                            maximumDate={flag ? moment(maxDate).subtract(1, 'days').toDate() : maxDate}
                            onTouchCancel={onChange}
                            value={value}
                            mode={'date'}
                            display="default"
                            onChange={onChange}
                        />
                    </View>
                )
            )}
        </>
    );
}

const styles = StyleSheet.create({
    iosModalContainer: {
        flex: 1,
        height: 100 * metrics.vh,
        backgroundColor: 'rgba(0,0,0,.2)',
        justifyContent: 'flex-end',
        flexDirection: 'column',
    },
    iosPickerContainer: {
        backgroundColor: 'white',
        padding: 15,
        paddingBottom: 40,
    },
    error: {
        color: 'red',
        fontSize: 15,
        padding: 15
    },
    button: {
        padding: 10,
        marginBottom: 8,
        borderRadius: 25,
        backgroundColor: theme.colors.primary,
        color: "#fff",
        minWidth: metrics.vw * 25,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonReset: {
        padding: 10,
        marginBottom: 8,
        borderRadius: 25,
        backgroundColor: "#fff",
        borderColor: theme.colors.primary,
        borderWidth: 1,
        color: theme.colors.primary,
        minWidth: metrics.vw * 25,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "#fff"
    },
    buttonResetText: {
        color: theme.colors.primary
    }
})