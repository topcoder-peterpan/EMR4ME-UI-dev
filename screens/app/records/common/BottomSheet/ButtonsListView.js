import React from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from "react-native";
import { Text } from "react-native-elements";
import { theme } from '../../../../../constants';

export default (props) => {
    const { buttonsList } = props;
    const renderItem = ({ item }) => {
        return <TouchableOpacity onPress={item.pressHandler}>
            <View style={styles.bottomSheetBtn}>
                <Text style={{...styles.bottomSheetBtnTitle, color: item.color}
                }>{item.title}</Text>
            </View>
        </TouchableOpacity>;
    }
    return <FlatList
        data={buttonsList}
        renderItem={renderItem}
    />;
};


const styles = StyleSheet.create({
    bottomSheetBtn: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingVertical: 20
    },
    bottomSheetBtnTitle: {
        color: theme.colors.primary,
        fontSize: 18,
        textAlign: 'center'
    },
});
