import React from 'react';
import { TouchableOpacity } from "react-native";
import { Icon, ThemeConsumer } from 'react-native-elements';

export default ({ onPress }) => {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <TouchableOpacity
                    onPress={onPress}
                    style={{ alignSelf: 'flex-end', marginHorizontal: 20, }}>
                    <Icon style={{ paddingHorizontal: 10 }}
                        name="ios-close"
                        type="ionicon"
                        size={50}
                        color={theme.colors.error} />
                </TouchableOpacity>
            )}
        </ThemeConsumer>
    );
}