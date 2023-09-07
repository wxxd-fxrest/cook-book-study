import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import styled from "styled-components";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image } from 'react-native'

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const ring1padding = useSharedValue(0);
    const ring2padding = useSharedValue(0);

    useEffect(()=>{
        ring1padding.value = 0;
        ring2padding.value = 0;
        setTimeout(()=> ring1padding.value = withSpring(ring1padding.value+hp(5)), 100);
        setTimeout(()=> ring2padding.value = withSpring(ring2padding.value+hp(5.5)), 300);

        setTimeout(()=> navigation.navigate('Home'), 2000);
    },[]); 

    return (
        <Container>
            <StatusBar style="light" />
            <Animated.View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 1000,
                    margin: '50px 0px',
                    padding: ring2padding
                }}>
                <Animated.View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 1000,
                        padding: ring2padding
                    }}>
                    <Image source={require('../../assets/images/welcome.png')}
                        style={{width: hp(20), height: hp(20)}} />
                </Animated.View>
            </Animated.View>


            <TextContainer>
                <Title style={{fontSize: hp(7)}}> Foody </Title>
                <SubTitle style={{fontSize: hp(2)}}> Food is always right </SubTitle>
            </TextContainer>
        </Container>
    )
};

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #f4951d;
`;

const TextContainer = styled.View`
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.Text`
    font-weight: bold;
    color: white;
`;

const SubTitle = styled.Text`
    color: white;
`;

export default WelcomeScreen;