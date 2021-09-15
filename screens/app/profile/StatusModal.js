import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
  } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import { fonts, theme } from '../../../constants';
import { i18n } from '../../../util';

export default props => {
    return (
        <Modal animationType="slide" transparent={true} visible={props.vis} animationType="fade">
            <TouchableWithoutFeedback
                onPress={() => {
                    props.toggle(false);
                }}>
                <View style={styles.centeredView}>
                    <TouchableOpacity style={styles.modalView} activeOpacity={1}>
                        <Icon name='ios-checkmark-circle' type='ionicon' size={50} color={props.type == 'success' ? theme.colors.success : theme.colors.error} style={{ marginTop: 10 }} />
                        <Text
                            style={{
                                fontFamily: fonts.MontserratBold,
                                fontSize: 20,
                                color: theme.colors.secondary,
                            }}>
                            {props.type == 'success' ? i18n.t('providers.linkSucceess') : i18n.t('providers.linkFailed')}
                        </Text>
                        <Button
                            title={props.type == 'success' ? i18n.t('common.confirm') : i18n.t('common.dismiss')}
                            containerStyle={{ marginTop: 30 }}
                            buttonStyle={{ paddingVertical: 10, borderRadius: 30 }}
                            loading={props.loading}
                            onPress={() => {
                                props.toggle(false);
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '100%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});