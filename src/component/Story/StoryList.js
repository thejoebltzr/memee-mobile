import React, { useState, useRef } from "react";
import {View, FlatList, Animated, TouchableOpacity, Image} from "react-native";
import StoryItem from "./StoryItem";
import Icon from 'react-native-vector-icons/AntDesign';

const StoryList = (props) => {
    const [showFloatAddBtn, setShowFloatAddBtn] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [ bounceValue, setBounceValue ] = useState(new Animated.Value(300));
    const {
        data,
        handleStoryItemPress,
        updateOffset,
        storyOffset,
        storyPage,
        storyLimit,
        setAddStoryModalVisible
    } = props;

    const animateShowFloatBtn = () => {
        Animated.timing(fadeAnim, {
            toValue:1,
            duration: 100,
            useNativeDriver:true,
        }).start();

    }

    const animateHideFloatBtn = () => {
        Animated.timing(fadeAnim, {
            toValue:0,
            duration: 50,
            useNativeDriver:true,
        }).start();
    }

    return (
        <>
        <View style={{position: 'absolute', zIndex: 4, alignSelf: 'center'}}>
            <Animated.View
            style={{
            opacity: fadeAnim,
            transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                }),
              }],
            backgroundColor: 'white',
            width: 50,
            height: 50,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: 1
            // transform: [{translateY: bounceValue}]
            // display: ''
            }}>
            <View style={{flex: 1, zIndex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => setAddStoryModalVisible(true)}>
                <Image style={{width: 35, height: 35, borderRadius: 50}} source={{uri: global.userData.imgurl}} />
                <Icon name='pluscircle' size={20} color="#4267B2" style={{position: 'absolute', right: -2, bottom: -2, backgroundColor: 'white', fontWeight: 'bold', borderRadius: 100}} />
                </TouchableOpacity>
            </View>
            </Animated.View>
        </View>
        <FlatList
            onScroll={event => {
                const x = Math.round(event.nativeEvent.contentOffset.x);
                console.log('offset', Math.round(event.nativeEvent.contentOffset.x));
                if (x >= 50) {
                    animateShowFloatBtn();
                }
                if (x < 50) {
                    animateHideFloatBtn();
                }
            }}
            keyExtractor={(item, index) => index.toString()}
            data={data}
            horizontal
            onEndReachedThreshold={0.1}
            onEndReached={() => {
                const mod = data.length % 10;
                if (mod === 0) {
                    updateOffset(storyOffset, storyPage, storyLimit)
                }
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
                <StoryItem
                    handleStoryItemPress={() =>
                        handleStoryItemPress && handleStoryItemPress(item, index)
                    }
                    item={item}
                    index={index}
                    setAddStoryModalVisible={setAddStoryModalVisible}
                />
            )}
            style={{zIndex: 1}}
        />
        </>
    );

}

export default StoryList;
