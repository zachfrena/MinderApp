import { ColorPropType } from 'react-native';
import {StyleSheet} from 'react-native';
import colors from '../../config/colors';

const styles = StyleSheet.create({
    // --- 1 container ---
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white
    },
    // --- 2 logo container ---
    logoContainer: {
        flex: 4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleBox: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        width: 300,
        height: 100,
        shadowColor: "#000",
        shadowOffset: {width: -8, height: 8},
        shadowOpacity: 0.3
    },
    title: {
        color: colors.white,
        fontSize: 50
    },
    // --- 2 input container ---
    inputContainer: {
        flex: 2,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    textInput: {
        backgroundColor: '#fff',
        height: 40,
        width: '85%',
        fontSize: 17,
        borderColor: '#000',
        borderWidth: 0.5,
        paddingLeft: 10
    },
    // --- 2 button container ---
    buttonContainer: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },  
    button: {
        backgroundColor: colors.primary,
        width: "85%",
        height: 40,
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 0.3
    },
    buttonText: {
        fontSize: 20,
        color: '#fff'
    },
    // --- 2 keyboard container ---
    keyboardContainer: {
        flex: 3
    }

})

export default styles;