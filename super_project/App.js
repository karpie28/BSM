import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, TouchableHighlight, Alert} from 'react-native';
import {AES} from "react-native-crypto-js";
import CryptoJS from "react-native-crypto-js";
import FingerprintScanner from 'react-native-fingerprint-scanner';

type
Props = {};
export default class App extends Component<Props> {

    state = {
        password: '',
        step: 0,
        text: 0,
        passwordToRead: '',
        passwordToChange: '',
        oldPassword: '',
        changedSuccessfully: false
    };

    componentDidMount() {
        FingerprintScanner
            .authenticate({onAttempt: console.log('Not authenticated')})
            .then(() => {
                Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
                this.setState({step: 1})
            })
            .catch((error) => {
                Alert.alert('Fingerprint Authentication', 'Authenticated not');
            });
    }

    componentWillUnmount() {
        FingerprintScanner.release();
    }

    setText(text) {
        let ciphertext = AES.encrypt(text, 'super_safe_private_key').toString();
        return AsyncStorage.setItem('text', ciphertext);
    }

    saveText = async () => {
        await this.setText(this.state.text)
        this.setState({step: 0})

        await AsyncStorage.getItem('password');
        await AsyncStorage.getItem('text');
    };

    decryptMessage = async () => {
        let text = await AsyncStorage.getItem('text');
        let message = AES.decrypt(text, 'super_safe_private_key').toString(CryptoJS.enc.Utf8);
        this.setState({decryptedMessage: message})
    };

    reset = async () => {
        AsyncStorage.removeItem('text');
        this.setState({step: 0})
    };

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.step === 1 && [

                    ]
                }
                {
                    this.state.step === 1 && [
                        <TouchableHighlight key="button3" onPress={this.decryptMessage}>
                            <Text>Read message</Text>
                        </TouchableHighlight>,
                        <Text key="decryptedMessage">{this.state.decryptedMessage}</Text>,
                        <TouchableHighlight key="button12321" onPress={this.reset}>
                            <Text>Reset Text</Text>
                        </TouchableHighlight>,

                        <Text key="labe1211l2">Change your previous text:</Text>,
                        <Text key="afsfassaffasfa"> </Text>,
                        <TextInput
                            key="input2"
                            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.setState({text})}
                        />,
                        <TouchableHighlight key="button2" onPress={this.saveText}>
                            <Text>Save Text</Text>
                        </TouchableHighlight>
                    ]
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
