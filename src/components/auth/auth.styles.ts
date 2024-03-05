import { StyleSheet } from "react-native";
import stylesheet from "../../stylesheet";

export default StyleSheet.create({
    titlePill: {
        marginTop: -35,
        marginLeft: 20,
        paddingLeft: 30,
        paddingRight: 60,
        paddingVertical: 10,
        backgroundColor: stylesheet.colors.primary,
        borderRadius: 50,
        alignSelf: 'flex-start'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    tagline: {
        fontSize: 30,
        marginHorizontal: 35,
        marginTop: 75,
        color: 'white',
        position: 'absolute'
    }
});