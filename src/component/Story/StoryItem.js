import React, {useState, useEffect, useRef} from "react";
import {View, Image, TouchableOpacity, Text, StyleSheet, Platform, ImageBackground} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Video from "react-native-video";
import Icon from 'react-native-vector-icons/AntDesign'

const StoryItem = props => {

    const {
        item,
        index,
        setAddStoryModalVisible
    } = props;

    const [isPressed, setIsPressed] = useState(props?.item?.seen);

    useEffect(() => {
        if (prevSeen != props?.item?.seen) {
            setIsPressed(props?.item?.seen);
        }

    }, [props?.item?.seen]);

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const prevSeen = usePrevious(props?.item?.seen);

    const _handleItemPress = item => {
        const {handleStoryItemPress} = props;

        if (handleStoryItemPress) handleStoryItemPress(item);

        setIsPressed(true);
    };

    const { stories } = item;

    return (
        <View style={{flex: 1, flexDirection: 'row'}}>
            {
                (index === 0 && global.userData.user_id !== item.user_id) && (
                    <TouchableOpacity onPress={() => setAddStoryModalVisible(true)}>
                        <View style={{backgroundColor: '#201E23', height: 160, width: 115, borderRadius: 15 }}>
                            <View style={{flex: 2.5, flexDirection: 'column'}}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'normal'}}>Add story</Text>       
                            </View>           
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => setAddStoryModalVisible(true)}>
                                    <Image style={{width: 35, height: 35, borderRadius: 50}} source={{uri: global.userData.imgurl}} />
                                    <Icon name='pluscircle' size={20} color="#4267B2" style={{position: 'absolute', right: -2, bottom: -2, backgroundColor: 'white', fontWeight: 'bold', borderRadius: 100}} />
                                </TouchableOpacity>
                            </View>
                            <View style={{marginBottom: 5, marginTop: 10}}>
                            <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>You</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }
            {
                stories[stories.length - 1].story_video ? (
                    <TouchableOpacity style={{zIndex: 999}} onPress={() => _handleItemPress(item)}>
                        <TouchableOpacity disabled>
                            <View style={{backgroundColor: '#201E23', marginLeft: 7,  height: 160, width: 115, borderRadius: 15 }}>
                            <Video
                                // repeat
                                muted
                                source={{ uri: (item.stories.length && item.stories[stories.length - 1].story_video) && item.stories[stories.length - 1].story_video }}
                                resizeMode="stretch"
                                style={{
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    borderRadius: 15
                                }}
                            />
                            <View style={{flex: 2.5, flexDirection: 'column'}}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'normal'}}></Text>       
                                </View>           
                                </View>
                                {
                                    global.userData.user_id === item.user_id ? (
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity onPress={() => setAddStoryModalVisible(true)}>
                                                <Image style={{width: 35, height: 35, borderRadius: 50, borderWidth: 3, borderColor: 'white'}} source={{uri: global.userData.imgurl}} />
                                                <Icon name='pluscircle' size={20} color="#4267B2" style={{position: 'absolute', right: -2, bottom: -2, backgroundColor: 'white', fontWeight: 'bold', borderRadius: 100}} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Image style={{width: 35, height: 35, borderWidth: 3, borderColor: 'white', borderRadius: 50}} source={{uri: item.user_image}} />
                                        </View>
                                    )
                                }
                                <View style={{marginBottom: 5, marginTop: 10}}>
                                <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>{item.user_name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ) : stories[stories.length - 1].story_image && (
                    <TouchableOpacity onPress={() => _handleItemPress(item)}>
                        <View style={{backgroundColor: '#201E23', marginLeft: 7,  height: 160, width: 115, borderRadius: 15 }}>
                            <ImageBackground
                                source={{uri: item.stories.length && item.stories[stories.length - 1].story_image}}
                                imageStyle={{borderRadius: 10, height: 160, width: 115}}
                                // resizeMode="contain"
                                style={{flex: 1, justifyContent: 'center', height: 160, width: 115}}
                            >
                                <View style={{flex: 2.5, flexDirection: 'column'}}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'normal'}}></Text>       
                                </View>           
                                </View>
                                {
                                    global.userData.user_id === item.user_id ? (
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity onPress={() => setAddStoryModalVisible(true)}>
                                                <Image style={{width: 35, height: 35, borderRadius: 50, borderWidth: 3, borderColor: 'white'}} source={{uri: global.userData.imgurl}} />
                                                <Icon name='pluscircle' size={20} color="#4267B2" style={{position: 'absolute', right: -2, bottom: -2, backgroundColor: 'white', fontWeight: 'bold', borderRadius: 100}} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Image style={{width: 35, height: 35, borderWidth: 3, borderColor: 'white', borderRadius: 50}} source={{uri: item.user_image}} />
                                        </View>
                                    )
                                }
                                <View style={{marginBottom: 5, marginTop: 10}}>
                                <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>{item.user_name}</Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                )
            }
        </View>
    );
}

export default StoryItem;

