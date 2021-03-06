import React from 'react';
import {
    AsyncStorage,
    View,
    Image,
    Dimensions
} from 'react-native';
import { Container, Content, Button, Text, H3, Icon, List, ListItem, Left, Right, Body } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { LogoTitle } from '../../../components/header';
import { Pictures, Controles } from '../../../database/realm';
import Strings from '../../../language/fr';
import { reverseFormat } from '../../../utilities/index';

export class ArchiveListScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: <LogoTitle HeaderText={(typeof params.title == "undefined" ? '' : reverseFormat(params.title))} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            imagePerRow: 4,
            imageSize: {
                width: 0,
                height: 0,
            },
            images: [],
            pictures: [],
            controles: [],
            selectedStartDate: this.props.navigation.state.params.selectedStartDate,
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

        let userID = await AsyncStorage.getItem('userSessionId');
        let pictures = await Pictures(userID, this.state.selectedStartDate);
        let controles = await Controles(userID, this.state.selectedStartDate);

        this.props.navigation.setParams({
            title: this.props.navigation.state.params.selectedStartDate,
        });

        this.setState({
            pictures: pictures,
            controles: controles,
        });

        this._calculateSize();
    };

    _calculateSize() {
        let windowWidth = Dimensions.get('window').width;
        let size = windowWidth / this.state.imagePerRow
        this.setState({ imageSize: { width: size, height: size } })
    }

    render() {
        const { selectedStartDate } = this.state;

        return (
            <Container>
                <Grid>
                    <Row>
                        <Col style={{ borderBottomWidth: 1, borderColor: 'lightgray' }}>
                            <Content>
                                {!this.state.controles.length && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, }}>
                                    <Icon name='eye' fontSize={50} size={50} style={{ color: 'lightgray', fontSize: 100, }} />
                                    <Text style={{ color: 'lightgray', fontSize: 25, }} >{Strings.THERE_IS_NO_RECEP_CONTROLS}</Text>
                                </View>}
                                <List>
                                    {this.state.controles.map(row => {
                                        return <ListItem avatar onPress={() => this.props.navigation.navigate('ArchiveDetails', { controle: row })} style={{ marginTop: 15, }}>
                                            <Left>

                                            </Left>
                                            <Body >
                                                {row.type == 0 && <H3>{Strings.RECEPTION_CHECK} - {row.user.name}</H3>}
                                                {row.type == 1 && <H3>{Strings.CONTROLE_FROID} - {row.user.name}</H3>}
                                                {row.type == 2 && <H3>{Strings.NONCONFORME} - {row.user.name}</H3>}
                                                {/* {row.type == 0 && <Thumbnail source={{ uri: row.source }} />} */}
                                                {/* {row.type == 1 && <Thumbnail source={{ uri: row.signature }} />} */}
                                            </Body>
                                            <Right>
                                                <H3 note> {reverseFormat(row.date)}</H3>
                                            </Right>
                                        </ListItem>;
                                    })}
                                </List>
                            </Content>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ backgroundColor: 'black' }}>
                            <Content>
                                {!this.state.pictures.length && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, }}>
                                    <Icon name='camera' fontSize={50} size={50} style={{ color: 'white', fontSize: 100, }} />
                                    <Text style={{ color: 'white', fontSize: 25, }} >{Strings.THERE_IS_NO_PICTURES}</Text>
                                </View>}

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}>

                                    {this.state.pictures.map((row, index) => {
                                        return <Button
                                            style={{ width: this.state.imageSize.width, height: this.state.imageSize.height }}
                                            onPress={() => this.props.navigation.navigate('ArchiveGallery', {
                                                index: index,
                                                pictures: this.state.pictures,
                                            })}>
                                            <Image
                                                resizeMode={'cover'}
                                                style={{ width: this.state.imageSize.width, height: this.state.imageSize.height }}
                                                source={{ uri: row.source }}
                                            />
                                        </Button>
                                    })}
                                </View>
                            </Content>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
}