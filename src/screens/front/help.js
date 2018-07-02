import React from 'react';
import {
    View,
    Dimensions,
} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer } from 'native-base';
import Image from 'react-native-scalable-image';

import { NoBackButton, LogoTitle, Menu } from '../../components/header';
import Strings from '../../language/fr';

export class HelpScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerIcon: ({ tintColor }) => (
                <Icon name='camera' style={{ color: tintColor, }} />
            ),
            // headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={params.title} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            dimesions: { width, height } = Dimensions.get('window'),
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: this.props.navigation.state.params.title
        });
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    render() {

        let source = this.props.navigation.state.params.source;
        return (
            <Container style={{ flex: 1 }} onLayout={this._onLayout.bind(this)}>
                <Content style={{ width: this.state.dimesions.width }}>
                    {source == 'controle' && <Image
                        width={this.state.dimesions.width}
                        source={require('../../../images/controle.png')}
                    />}

                    {source == 'chaud' && <Image
                        width={this.state.dimesions.width}
                        source={require('../../../images/chaud.png')}
                    />}

                    {source == 'froid' && <Image
                        width={this.state.dimesions.width}
                        source={require('../../../images/froid.png')}
                    />}

                    {source == 'nonconforme' && <Image
                        width={this.state.dimesions.width}
                        source={require('../../../images/nonconforme.png')}
                    />}

                </Content>
            </Container>
        );
    }
}