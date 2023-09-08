import React, { useEffect, useState } from 'react';
import { StatusBar, ScrollView, TouchableOpacity, View } from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe';
import Animated, { Easing, interpolate, FadeIn, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';

const RecipeDetailScreen = (props) => {
    const item = props.route.params;
    const [isFavourite, setIsFavourite] = useState(false);
    const navigation = useNavigation();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMealData(item.idMeal);
    }, []);

    const getMealData = async (id) => {
        try {
            const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            if (response && response.data) {
                setMeal(response.data.meals[0]);
                setLoading(false);
            }
        } catch (err) {
            console.log('error: ', err.message);
        }
    };

    const ingredientsIndexes = (meal) => {
        if (!meal) return [];
        let indexes = [];
        for (let i = 1; i <= 20; i++) {
            if (meal['strIngredient' + i]) {
                indexes.push(i);
            }
        }
        return indexes;
    };

    const getYoutubeVideoId = (url) => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    };

    const translateX = useSharedValue(0);

    useEffect(() => {
        translateX.value = withSpring(0, { damping: 2, stiffness: 80 });
    }, []);

    const translateXStyle = {
        transform: [{ translateX: translateX }],
    };

    return (
        <Container>
            <StatusBar barStyle="light-content" />
            <ScrollView style={{ backgroundColor: 'white' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                <RecipeImage source={{ uri: item.strMealThumb }} />
                <AnimatedContainer entering={FadeIn.delay(200).duration(1000)}  pointerEvents="box-none">
                    <IconContainer onPress={() => navigation.goBack()}>
                        <View style={styles.iconContainer}>
                            <FontAwesome name="chevron-left" size={35} color="#e17055" />
                        </View>
                    </IconContainer>
                    <IconContainer onPress={() => setIsFavourite(!isFavourite)}>
                        <View style={styles.iconContainer}>
                            <FontAwesome name={isFavourite ? 'heart' : 'heart-o'} size={35} color={isFavourite ? 'red' : 'white'} />
                        </View>
                    </IconContainer>
                </AnimatedContainer>
                {loading ? (
                    <Loading size="large" style={{ marginTop: hp(2) }} />
                ) : (
                    <DescriptionContainer>
                        <MealName>{item.strMeal}</MealName>
                        <MealArea>{item.strArea}</MealArea>
                        <MiscContainer>
                            <MiscItem>
                                <MiscIconContainer>
                                    <FontAwesome name="clock-o" size={30} color="#525252" />
                                </MiscIconContainer>
                                <MiscText>35</MiscText>
                                <MiscText2>Mins</MiscText2>
                            </MiscItem>
                            <MiscItem>
                                <MiscIconContainer>
                                    <FontAwesome name="users" size={30} color="#525252" />
                                </MiscIconContainer>
                                <MiscText>03</MiscText>
                                <MiscText2>Servings</MiscText2>
                            </MiscItem>
                            <MiscItem>
                                <MiscIconContainer>
                                    <FontAwesome name="fire" size={30} color="#525252" />
                                </MiscIconContainer>
                                <MiscText>103</MiscText>
                                <MiscText2>Cal</MiscText2>
                            </MiscItem>
                            <MiscItem>
                                <MiscIconContainer>
                                    <FontAwesome name="square" size={30} color="#525252" />
                                </MiscIconContainer>
                                <MiscText>Easy</MiscText>
                            </MiscItem>
                        </MiscContainer>
                        <IngredientsContainer>
                            <IngredientTitle>Ingredients</IngredientTitle>
                            {ingredientsIndexes(meal).map((i) => (
                                <IngredientItem key={i}>
                                <IngredientBullet />
                                <IngredientText>{meal[`strMeasure${i}`]}</IngredientText>
                                <IngredientText>{meal[`strIngredient${i}`]}</IngredientText>
                                </IngredientItem>
                            ))}
                        </IngredientsContainer>
                        <InstructionsContainer>
                            <InstructionTitle>Instructions</InstructionTitle>
                            <InstructionText>{meal.strInstructions}</InstructionText>
                        </InstructionsContainer>
                        {meal.strYoutube && (
                            <RecipeVideoContainer>
                                <RecipeVideoTitle>Recipe Video</RecipeVideoTitle>
                                <YouTubeIframe videoId={getYoutubeVideoId(meal.strYoutube)} height={hp(30)} />
                            </RecipeVideoContainer>
                        )}
                    </DescriptionContainer>
                )}
            </ScrollView>
        </Container>
    );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const RecipeImage = styled.Image`
  width: 100%;
  height: ${hp(50)}px;
  border-bottom-left-radius: ${hp(4)}px;
  border-bottom-right-radius: ${hp(4)}px;
  margin-top: ${hp(0.3)}px;
`;

const AnimatedContainer = styled(Animated.View)`
    width: 100%;
    position: absolute;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: ${hp(6)}px;
`;

const IconContainer = styled.TouchableOpacity`
    padding: ${hp(2)}px;
    border-radius: 25px;
    /* background-color: white; */
`;

const styles = {
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black', // 그림자 색상 설정
        shadowOpacity: 0.3,   // 그림자 투명도 설정
        shadowOffset: { width: 0, height: 2 }, // 그림자 위치 조절
        shadowRadius: 4,      // 그림자 반경 설정
        elevation: 5,         // Android에서 그림자 효과를 위해 필요한 설정
    },
};

const DescriptionContainer = styled.View`
    padding: ${wp(4)}px;
`;

const MealName = styled.Text`
  font-size: ${hp(2.5)}px;
  font-weight: bold;
  color: #333;
`;

const MealArea = styled.Text`
  font-size: ${hp(2)}px;
  font-weight: medium;
  color: #666;
  margin-top: ${hp(0.4)}px;
`;

const MiscContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    margin-top: ${hp(0.8)}px;
`;

const MiscItem = styled.View`
    flex: 1;
    align-items: center;
    flex: 1;
    border-radius: 50px;
    background-color: #f4951d;
    padding: 8px;
    margin: 0px 5px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3); /* 그림자 효과 */
`;

const MiscIconContainer = styled.View`
    height: ${hp(5)}px;
    width: ${hp(5)}px;
    background-color: white;
    border-radius: ${hp(2.5)}px;
    align-items: center;
    justify-content: center;
`;

const MiscText = styled.Text`
    font-size: ${hp(2)}px;
    font-weight: bold;
    color: #333;
    padding-top: ${hp(1)}px;
    padding-bottom: ${hp(1)}px;
`;

const MiscText2 = styled.Text`
    font-size: ${hp(1.5)}px;
    font-weight: bold;
    color: #333;
    padding-top: ${hp(0.5)}px;
    padding-bottom: ${hp(2.5)}px;
`;

const IngredientsContainer = styled.View`
  margin-top: ${wp(4)}px;
`;

const IngredientTitle = styled.Text`
  font-size: ${hp(2.5)}px;
  font-weight: bold;
  color: #333;
`;

const IngredientItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${hp(0.8)}px;
`;

const IngredientBullet = styled.View`
  height: ${hp(1.2)}px;
  width: ${hp(1.2)}px;
  background-color: #fbbf24;
  border-radius: ${hp(0.6)}px;
  margin-right: ${wp(2)}px;
`;

const IngredientText = styled.Text`
  font-size: ${hp(2)}px;
  font-weight: medium;
  color: #666;
`;

const InstructionsContainer = styled.View`
  margin-top: ${wp(4)}px;
`;

const InstructionTitle = styled.Text`
  font-size: ${hp(2.5)}px;
  font-weight: bold;
  color: #333;
`;

const InstructionText = styled.Text`
  font-size: ${hp(2)}px;
  color: #666;
  margin-top: ${hp(0.8)}px;
`;

const RecipeVideoContainer = styled.View`
  margin-top: ${wp(4)}px;
`;

const RecipeVideoTitle = styled.Text`
  font-size: ${hp(2.5)}px;
  font-weight: bold;
  color: #333;
`;

export default RecipeDetailScreen;
