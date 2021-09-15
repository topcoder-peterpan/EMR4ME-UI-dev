import React from 'react';
import { Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import { i18n } from '../../../util';
export default ({ fullName, setFullName }) => {
    return (
        <View style={{ marginTop: 30 }}>
        <Text style={{ color: '#BCBCBC', fontSize: 16 }}>{i18n.t("common.yourSignature")}</Text>
        <Input placeholderTextColor="#d3d3d3" placeholder={i18n.t('common.fullName')} value={fullName} onChangeText={setFullName} />
      </View>
    )
}