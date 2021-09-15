import Toast from "react-native-root-toast";

export default {
    showSuccessToast: (msg) => Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#92C40B',
        textColor: '#FFF',
        opacity: 1,
    }), showErrorToast: (msg) => Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        opacity: 1,
        backgroundColor: '#D5351F',
        textColor: '#FFF',
    })
}