import React, {
    Component
} from 'react';

import ReactNative, {
    View, Modal, Platform, Alert
} from 'react-native';
import { Textarea, Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer, Form, Item, Label, Input, Radio, ListItem, Right, Left } from 'native-base';
import Strings from '../../../language/fr';
import SignatureCapture from 'react-native-signature-capture';

const toolbarHeight = Platform.select({
    android: 0,
    ios: 22
});

const modalViewStyle = {
    paddingTop: toolbarHeight,
    flex: 1
};

export default class SignatureView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
    }

    show(display) {
        this.setState({ visible: display });
    }

    render() {
        const { visible } = this.state;

        return (
            <Modal transparent={false} visible={visible} onRequestClose={this._onRequreClose.bind(this)}>
                <View style={modalViewStyle}>
                    <View style={{ padding: 10, flexDirection: 'row' }}>
                        <Text onPress={this._onPressClose.bind(this)}>{' x '}</Text>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14 }}>{Strings.PLEASE_WRITE_YOUR_SIGNATURE}</Text>
                        </View>
                    </View>
                    <SignatureCapture
                        style={{ flex: 1, width: '100%' }}
                        onDragEvent={this._onDragEvent.bind(this)}
                        onSaveEvent={this._onSaveEvent.bind(this)}
                        showTitleLabel ={true}
                    />
                </View>

            </Modal>
        );
    }

    _onPressClose() {
        this.show(false);
    }

    _onRequreClose() {
        this.show(false);
    }

    _onDragEvent() {
        // This callback will be called when the user enters signature
        console.log("dragged");
    }

    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        this.props.onSave && this.props.onSave(result);
    }
}