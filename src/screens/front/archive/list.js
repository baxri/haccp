import React from 'react';
import {
    AsyncStorage,
    View,
    Image,
    Dimensions
} from 'react-native';
import { Container, Content, Button, Text, Icon, List, ListItem, Right, Body } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';
import { LogoTitle } from '../../../components/header';
import { Pictures, Controles } from '../../../database/realm';
import Strings from '../../../language/fr';
import { reverseFormat, FilePicturePath } from '../../../utilities/index';
import { styles } from '../../../utilities/styles';
import strings from '../../../language/fr';

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
            loading: 1,
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

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _bootstrapAsync = async () => {


        let userID = await AsyncStorage.getItem('userSessionId');
        let pictures = await Pictures(userID, this.state.selectedStartDate);
        let controles = await Controles(userID, this.state.selectedStartDate);

        // alert(this.state.selectedStartDate);

        this.props.navigation.setParams({
            title: this.props.navigation.state.params.selectedStartDate,
        });

        this.setState({
            pictures: pictures,
            controles: controles,
        });

        this._hideLoader();
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
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
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
                                            <Body >
                                                {row.type == 0 && <Text style={styles.text}>{Strings.RECEPTION_CHECK} - {row.user.name + " " + row.user.lastname}</Text>}
                                                {row.type == 1 && <Text style={styles.text}>{Strings.CONTROLE_FROID} - {row.user.name + " " + row.user.lastname}</Text>}
                                                {row.type == 2 && <Text style={styles.text}>{Strings.NONCONFORME} - {row.user.name + " " + row.user.lastname}</Text>}
                                                {row.type == 3 && <Text style={styles.text}>{Strings.CLEANING_SCHEDULE} - {row.user.name + " " + row.user.lastname}</Text>}
                                                <Text style={{ marginTop: 10, }}>{strings.TIME}: {row.created_at.toLocaleTimeString()}</Text>
                                            </Body>
                                            <Right style={{ paddingRight: 30, paddingTop: 20 }}>
                                                {row.confirmed == 1 && <Icon name='checkmark' style={{ color: 'green', fontSize: 25 }} />}
                                                {row.confirmed != 1 && <Icon name='close' style={{ color: 'red', fontSize: 25 }} />}
                                            </Right>
                                        </ListItem>;
                                    })}
                                </List>
                            </Content>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ backgroundColor: '#2E2E2E' }}>
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
                                            style={{ width: this.state.imageSize.width - 0.1, height: this.state.imageSize.height }}
                                            onPress={() => this.props.navigation.navigate('ArchiveGallery', {
                                                index: index,
                                                pictures: this.state.pictures,
                                            })}>
                                            <Image
                                                resizeMode={'cover'}
                                                style={{ width: this.state.imageSize.width, height: this.state.imageSize.height }}
                                                source={{ uri: FilePicturePath() + row.source }}
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