import { Image } from "react-native";

const images = {
    landing: require('../assets/images/landing.png'),
    emptyScreen: require('../assets/images/empty-screen.png'),
    avatar: require('../assets/images/default-avatar.png'),
    doc1: require('../assets/images/doc1.png'),
    doc2: require('../assets/images/doc2.png'),
    doc3: require('../assets/images/doc3.png'),
    bg: require('../assets/images/risk-button.png'),
    icon:require('../assets/images/launch_screen-icon.png'),
    flicker:require('../assets/images/launch_screen-flicker.png'),
    riskHeader: require('../assets/images/risk-header.png'),
    CheckedCheckbox:require('../assets/images/checked-checkbox.svg'),
    UncheckedCheckbox: require('../assets/images/unchecked-checkbox.svg'),
}
const cacheImages = () => {
    return Object.keys(images).map(key => Image.prefetch(images[key]));
}

export default {
    ...images,
    cacheImages
}