import React from 'react';
import {
    View,
    Image,

} from 'react-native';
import { Container, Content, Button, Text, Card, Body, CardItem } from 'native-base';
import { LogoTitle } from '../../../components/header';
import Strings from '../../../language/fr';
import { reverseFormat } from '../../../utilities/index';
import { FilePicturePath, toDate } from '../../../utilities/index';

export class NonConformeDetailsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

        return {
            headerTitle: <LogoTitle HeaderText={Strings.RECEPTION_CHECK} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            item: this.props.navigation.state.params.controle,
            equipments: [],
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

    };

    _parseEquipments() {

        // let ret = [];

        // this.state.item.equipments.map(equipment => {

        //     let slice = equipment.split(":");

        //     let obj = {
        //         id: slice[0],
        //         name: slice[1],
        //         value: slice[2],
        //     };

        //     ret.push(obj);
        // });

        // this.setState({ equipments: ret });

    }

    componentDidMount() {
        this._parseEquipments();
    };

    render() {
        return (
            <Container>
                <Content padder>
                    <Card>
                        <CardItem header bordered>
                            {this.state.item.type == 0 && <Text>{Strings.PRODUCT}: {this.state.item.produit}</Text>}
                            {this.state.item.type == 1 && <Text>{Strings.CONTROLE_FROID}</Text>}
                            {this.state.item.type == 2 && <Text>{Strings.PRODUCT}: {this.state.item.produit}</Text>}
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {this.state.item.source != '' && <Button
                                        style={{ width: 70, height: 70, borderRadius: 100, }}
                                        onPress={() => this.props.navigation.navigate('NonConformeGallery', {
                                            index: 0,
                                            pictures: [{ source: this.state.item.source }],
                                        })}><View style={{ backgroundColor: 'white', borderRadius: 100, borderWidth: 1, }}>
                                            <Image
                                                resizeMode={'cover'}
                                                style={{ width: 70, height: 70, borderRadius: 100, }}
                                                source={{ uri: FilePicturePath() + this.state.item.source }}
                                            /></View></Button>}

                                    {this.state.item.signature != '' && <Button
                                        style={{ width: 70, height: 70, borderRadius: 100, }}
                                        onPress={() => this.props.navigation.navigate('NonConformeGallery', {
                                            index: 1,
                                            pictures: [{ source: this.state.item.signature }],
                                        })}><View style={{ backgroundColor: 'white', borderRadius: 100, borderWidth: 1, }}>
                                            <Image
                                                resizeMode={'cover'}
                                                style={{ width: 70, height: 70, borderRadius: 100, }}
                                                source={{ uri: FilePicturePath() + this.state.item.signature }}
                                            /></View></Button>}
                                </View>
                            </Body>
                        </CardItem>

                        {this.state.item.type == 0 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.FOURNISER}: {this.state.item.fourniser}</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 0 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.DUBL}: {this.state.item.dubl}</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 0 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.ASPECT}: {this.state.item.aspect == 0 ? Strings.BON : Strings.MAUVAIS}</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 0 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.DUPRODUIT}: {this.state.item.du_produit}</Text>
                            </Body>
                        </CardItem>}


                        {this.state.item.type == 0 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.EMBALAGE_INTATC}: {this.state.item.intact == 0 ? Strings.NO : Strings.YES}</Text>
                            </Body>
                        </CardItem>}


                        {this.state.item.type == 0 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.ETIQUTAGE_CONF}: {this.state.item.conforme == 0 ? Strings.NO : Strings.YES}</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 0 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.AUTRES}: {this.state.item.autres}</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 0 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.ACTION_CORECTIVES}: {this.state.item.actions}</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 1 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.AUTRES}: {this.state.item.autres}°</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 1 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.AUTRES_CORECTIVES}: {this.state.item.actions}</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 2 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.QUANTITY}: {this.state.item.quantity}</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 2 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.VALORISATION}: {this.state.item.valorisation} ‎€</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 2 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.CAUSES}: {this.state.item.causes}‎</Text>
                            </Body>
                        </CardItem>}

                        {this.state.item.type == 2 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.DEVENIR}: {this.state.item.devenir}‎</Text>
                            </Body>
                        </CardItem>}


                        {this.state.item.type == 2 && <CardItem bordered>
                            <Body>
                                <Text>{Strings.TRAITMENT_DATE}: {reverseFormat(this.state.item.traitment_date.toISOString().substring(0, 10))}</Text>
                            </Body>
                        </CardItem>}

                        {true && <CardItem bordered>
                            <Body>
                                <Text>{Strings.DATETIME}: {reverseFormat(toDate(this.state.item.created_at))}</Text>
                            </Body>
                        </CardItem>}
                    </Card>
                </Content>
            </Container>
        );
    }
}