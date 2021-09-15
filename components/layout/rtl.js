import React from 'react';
import { connect } from 'react-redux';
import { i18n } from '../../util';
import { Text, Button } from 'react-native-elements'
import { View } from 'native-base';

const mapStateToProps = (state) => ({
    isRTL: state.UI.isRTL,
});
const mapDispatchToLProps = (dispatch) => ({
    setLanguage: (lang) => dispatch(i18n.setLanguage(lang)),
});
export default connect(mapStateToProps, mapDispatchToLProps)(({ children, isRTL, setLanguage }) => {
    return (
        <View style={{ direction: isRTL ? 'rtl' : 'ltr', flex: 1 }}>
            {children}
            {/* <View>
                <Text>{i18n.t('hi')}</Text>
                <Button onPress={() => setLanguage('en')} title={'press here'} />
            </View> */}
        </View>
    )
})