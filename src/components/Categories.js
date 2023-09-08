import React from 'react';
import styled, { css } from 'styled-components/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { CachedImage } from '../helpers/image';
import Animated, { FadeInDown } from 'react-native-reanimated';

const Categories = ({categories, activeCategory, handleChangeCategory}) => {
    return (
        <Animated.View entering={FadeInDown.duration(500).springify()}>
            <ScrollBox horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 15}}
                >
                {categories.map((cat, index) => {
                    let isActive = cat.strCategory == activeCategory;
                    let activeButtonClass = isActive ? { backgroundColor: 'rgba(255, 191, 0, 0.4)' } : { backgroundColor: 'rgba(0, 0, 0, 0.1)' };
                    return (
                        <CategoryButton key={index}
                            onPress={() => handleChangeCategory(cat.strCategory)}
                        >   
                            <ImageContainer activeButtonClass={activeButtonClass}>
                                <CachedImage uri={cat.strCategoryThumb}
                                    style={{ 
                                        width: hp(6),
                                        height: hp(6),
                                        borderRadius: (hp(6) / 2),
                                    }}
                                />
                            </ImageContainer>
                            <CategoryText active={cat.strCategory === activeCategory}>
                                {cat.strCategory}
                            </CategoryText>
                        </CategoryButton>
                    )
                })}
            </ScrollBox>
        </Animated.View>
    )
};

const Container = styled.View``;

const Title = styled.Text``;

const ScrollBox = styled.ScrollView`
    width: 100%;
`;

const CategoryButton = styled.TouchableOpacity`
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin-right: 20px;
`;

const ImageContainer = styled.View`
    ${({ activeButtonClass }) => css`
        border-radius: 999px; /* 혹은 충분히 큰 값 */
        padding: 10px;
        ${activeButtonClass && activeButtonClass}
    `}
`;

const CategoryText = styled.Text`
    font-size: ${hp(1.6)}px;
    color: ${(props) => (props.active ? 'your-active-color' : 'your-inactive-color')};
`;

export default Categories; 