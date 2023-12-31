import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import styled from "styled-components";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {BellIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import Categories from "../components/Categories";
import axios from 'axios';
import Recipes from "../components/Recipes";

const HomeScreen = () => {
    const [activeCategory, setActiveCategory] = useState('Beef');
    const [categories, setCategories] = useState([]);
    const [meals, setMeals] = useState([]);

    useEffect(()=>{
        getCategories();
        getRecipes();
    },[]);
    
    const handleChangeCategory = category => {
        getRecipes(category);
        setActiveCategory(category);
        setMeals([]);
    };

    const getCategories = async() => {
        try {
        const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php');
        // console.log('got categories: ',response.data);
            if(response && response.data){
                setCategories(response.data.categories);
            }
        } catch(err) {
            console.log('error: ',err.message);
        }
    };

    const getRecipes = async(category="Beef") => {
        try {
        const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        // console.log('got recipes: ',response.data);
            if(response && response.data){
                setMeals(response.data.meals);
            }
        } catch(err) {
            console.log('error: ',err.message);
        }
    };

    return (
        <Container>
            <StatusBar style="dark"/>
            <ScrollBox
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 50}}>

                <ProfileBox style={{marginTop: hp(9)}}>
                    <Image source={require('../../assets/images/avatar.png')} style={{height: hp(5), width: hp(5)}} />
                    <BellIcon size={hp(3.5)} color="gray" />
                </ProfileBox>

                <TextContainer>
                    <TextWrapper>
                        <SmallText>Hello, Noman!</SmallText>
                    </TextWrapper>
                    <TextWrapper>
                        <LargeText>Make your own food,</LargeText>
                    </TextWrapper>
                    <TextWrapper>
                        <LargeText>
                            stay at <HighlightedText>home</HighlightedText>
                        </LargeText>
                    </TextWrapper>
                </TextContainer>

                <SearchContainer>
                    <SearchInput
                        placeholder='Search any recipe'
                        placeholderTextColor='gray'
                    />
                    <IconWrapper>
                        <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
                    </IconWrapper>
                </SearchContainer>

                <CategoryContainer>
                    { categories.length>0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} /> }
                </CategoryContainer>

                <RecipeContainer>
                    <Recipes meals={meals} categories={categories} />
                </RecipeContainer>
            </ScrollBox>
        </Container>
    )
};

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0px 30px;
`;

const ScrollBox = styled.ScrollView`
    width: 100%;
`;

const ProfileBox = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
`;

const TextContainer = styled.View`
    margin: ${hp(1.6)}px 0px;
    margin-bottom: ${hp(1)}px;
    flex-direction: column;
`;

const TextWrapper = styled.View`
    margin-bottom: ${hp(0.7)}px;
`;

const SmallText = styled.Text`
    font-size: ${hp(1.7)}px;
    color: #636e72;
`;

const LargeText = styled.Text`
    font-size: ${hp(3.8)}px;
    font-weight: bold;
    color: #636e72;
`;

const HighlightedText = styled.Text`
    font-size: ${hp(3.8)}px;
    font-weight: bold;
    color: #e17055;
`;

const SearchContainer = styled.View`
    margin: ${hp(1.6)}px 0px;
    flex-direction: row;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: ${hp(5)}px;
    padding: ${hp(0.5)}px;
`;

const SearchInput = styled.TextInput`
    flex: 1;
    font-size: ${hp(1.7)}px;
    margin: ${hp(1.5)}px 0px;
    padding-left: ${hp(2)}px;
    letter-spacing: ${hp(0.15)}px;
    color: gray;
`;

const IconWrapper = styled.View`
    background-color: white;
    border-radius: 100px;
    padding: ${hp(1)}px;
    margin-right: ${hp(0.5)}px;
`;

const CategoryContainer = styled.View`
  /* Category 컴포넌트에 대한 스타일 */
`;

const RecipeContainer = styled.View`
  /* Recipe 컴포넌트에 대한 스타일 */
`;

export default HomeScreen;