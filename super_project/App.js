import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, AsyncStorage, TouchableHighlight} from 'react-native';
import bcrypt from 'react-native-bcrypt';
import {AES} from "react-native-crypto-js";
import CryptoJS from "react-native-crypto-js";
import FingerprintScanner from "react-native-fingerprint-scanner";

type Props = {};
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

    setPassword(password) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        return AsyncStorage.setItem('password', hash);
    }

    setText(text) {
        let ciphertext = AES.encrypt(text, this.state.password).toString();
        return AsyncStorage.setItem('text', ciphertext);
    }

    savePassword = async () => {
        await this.setPassword(this.state.password)
        this.setState({step: 1})
    };

    saveText = async () => {
        await this.setText(this.state.text)
        this.setState({step: 2})

        await AsyncStorage.getItem('password');
        await AsyncStorage.getItem('text');
    };

    decryptMessage = async () => {
        let password = await AsyncStorage.getItem('password');
        let text = await AsyncStorage.getItem('text');

        if (bcrypt.compareSync(this.state.passwordToRead, password)) {
            let message = AES.decrypt(text, this.state.passwordToRead).toString(CryptoJS.enc.Utf8);
            this.setState({decryptedMessage: message})
        } else {
            this.setState({decryptedMessage: ''})
        }
    };

    changePassword = async () => {
        let password = await AsyncStorage.getItem('password');
        if (bcrypt.compareSync(this.state.oldPassword, password)) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(this.state.passwordToChange, salt);
            let text = await AsyncStorage.getItem('text');
            let message = AES.decrypt(text, this.state.oldPassword).toString(CryptoJS.enc.Utf8);
            let ciphertext = AES.encrypt(message, this.state.passwordToChange).toString();
            AsyncStorage.setItem('text', ciphertext);
            this.setState({changedSuccessfully: true})
            return AsyncStorage.setItem('password', hash);
        }
    };

    reset = async () => {
        AsyncStorage.removeItem('password');
        AsyncStorage.removeItem('text');
        this.setState({step: 0})
    };

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.step === 0 && [
                        <Text key="label">Please write your password below</Text>,
                        <TextInput
                            key="input"
                            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 100}}
                            onChangeText={(password) => this.setState({password})}
                        />,
                        <TouchableHighlight key="button" onPress={this.savePassword}>
                            <Text>Save Password</Text>
                        </TouchableHighlight>
                    ]
                }
                {
                    this.state.step === 1 && [
                        <Text key="label2">Please write your text below</Text>,
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
                {
                    this.state.step === 2 && [
                        <Text key="label3">Please write your password below to read message</Text>,
                        <TextInput
                            key="input3"
                            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 100}}
                            onChangeText={(passwordToRead) => this.setState({passwordToRead})}
                        />,
                        <TouchableHighlight key="button3" onPress={this.decryptMessage}>
                            <Text>Read message with given password</Text>
                        </TouchableHighlight>,
                        <Text key="decryptedMessage">{this.state.decryptedMessage}</Text>,
                        <Text key="label4">Or... Change current password:</Text>,
                        <Text key="label5"> </Text>,
                        <Text key="label6">Old Password</Text>,
                        <TextInput
                            key="input4"
                            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 100}}
                            onChangeText={(oldPassword) => this.setState({oldPassword})}
                        />,
                        <Text key="label7">New Password</Text>,
                        <TextInput
                            key="input5"
                            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 100}}
                            onChangeText={(passwordToChange) => this.setState({passwordToChange})}
                        />,
                        <TouchableHighlight key="button4" onPress={this.changePassword}>
                            <Text>Change password</Text>
                        </TouchableHighlight>,
                        this.state.changedSuccessfully && <Text key="fasfas">Successfully Changed</Text>,
                        <Text key="label327"> </Text>,
                        <Text key="label3217"> </Text>,
                        <Text key="label417"> </Text>,
                        <TouchableHighlight key="button12321" onPress={this.reset}>
                            <Text>Reset All</Text>
                        </TouchableHighlight>,
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