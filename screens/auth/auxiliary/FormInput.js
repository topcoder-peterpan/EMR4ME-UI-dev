import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { Keyboard } from 'react-native';

export default (props)  => {
    const { noReqMsg, trim, formInputs, placeholder, iconName, fieldName, candidate, value, input, change, theme, arrayName } = props;
    const inputField = arrayName ? formInputs[arrayName][fieldName] : formInputs[fieldName];
    let errprMessage = inputField.touched && !inputField.valid && inputField.errors.length > 0 ? inputField.errors[0].value : '';
    if (noReqMsg && inputField.errors.length > 0 && inputField.errors[0].key === 'required')
        errprMessage = '';
    else if (noReqMsg && !value)
        errprMessage = '';
        return (<Input
        {...props}
        errorMessage={errprMessage}
        placeholder={placeholder}
        leftIcon={iconName ? <Icon name={iconName} size={20} color={theme.colors.secondary} /> : null}
        placeholderTextColor="#d3d3d3" 
        value={value}
        autoCompleteType="off"
        autoCorrect={false}
        returnKeyType={'default'}
        blurOnSubmit={false}
        onSubmitEditing={() => Keyboard.dismiss()}
        onChangeText={value => {
            input(trim ? value.trim() : value, fieldName, arrayName ? arrayName : candidate);
            if(change)
                change();
        }}
    />)
}