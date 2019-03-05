import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Image,
    ToastAndroid,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H2, Icon, FooterTab, Footer } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { Pictures } from '../../../database/realm';
import Gallery from 'react-native-image-gallery';
import { reverseFormat, FilePicturePath } from '../../../utilities/index';
import Strings from '../../../language/fr';

export class ArchiveGalleryScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: <LogoTitle HeaderText={Strings.GALLERY} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            images: [],
            index: this.props.navigation.state.params.index,
        };
    }

    render() {

        let pictures = this.props.navigation.state.params.pictures;

        var images = [];
        pictures.map(row => {
            images.push({
                caption: row.date,
                source: { uri: FilePicturePath() + row.source }
            });
        });

        return (
            <View style={{ flex: 1 }} >
                <Gallery
                    style={{ flex: 1, backgroundColor: 'black' }}
                    images={images}
                    initialPage={this.state.index}
                />
            </View>
        );
    }
}