import React from 'react';
import {
    View,

} from 'react-native';

import { LogoTitle } from '../../../components/header';
import Gallery from 'react-native-image-gallery';
import { FilePicturePath } from '../../../utilities/index';
import Strings from '../../../language/fr';

export class ArchiveGalleryScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

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