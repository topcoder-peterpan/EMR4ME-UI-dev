import React from "react";
import { Text } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

import { View, Modal } from "react-native";
import { theme, metrics, fonts } from "../../constants";
import { useDispatch } from "react-redux";
import { hideAlert } from "../../store/actions/creators/UI";
import { StyleSheet } from "react-native";


export default (props) => {
    const { visible, iconName, type, title, message, present } = props;
    const dispatch = useDispatch();
    return (
        <>
            <Modal
                animationType="fade"
                transparent
                visible={visible}
                onDismiss={() => present ? null : dispatch(hideAlert())}
                onRequestClose={() => present ? null : dispatch(hideAlert())}
            >
                <View
                    onTouchEnd={() => present ? null : dispatch(hideAlert())}
                    style={styles.container}>
                    <View
                        style={styles.body}
                    >
                        <View style={styles.iconWrapper}>
                            <Icon name={iconName || 'info'} size={50} color={type === 'error' ? theme.colors.error : 'white'} ></Icon>
                        </View>
                        <View style={styles.textWrapper}>
                            <Text style={styles.textItem}>{title}</Text>
                            <Text style={styles.textItem}>{message}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.2)',
    },
    body: {
        backgroundColor: theme.colors.secondary,
        padding: 30,
        paddingTop: 40,
        height: 17 * metrics.vh,
        width: 100 * metrics.vw,
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    iconWrapper:{
        height: 15 * metrics.vh,
        width: 20 * metrics.vw,
        justifyContent:'flex-end'
        
    },
    textWrapper:{
        width: 70 * metrics.vw,
        height: 10 * metrics.vh,
        paddingTop: 2 * metrics.vh,
        justifyContent:'center',
    },
    textItem:{
        fontFamily: fonts.MontserratBold,
        color:'white',
        fontWeight:'bold'
    }
})