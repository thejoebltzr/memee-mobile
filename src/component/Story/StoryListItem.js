import moment from 'moment';
import React, {useState, useEffect, useRef} from 'react';
import {
    Animated,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    ActivityIndicator,
    View,
    Platform,
    SafeAreaView,
    Alert
} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import GestureRecognizer from 'react-native-swipe-gestures';
import {useNavigation} from '@react-navigation/native';
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';

const {width, height} = Dimensions.get('window');

export const StoryListItem = props => {
    const navigation = useNavigation();
    const stories = props.stories;

    const [load, setLoad] = useState(true);
    const [pressed, setPressed] = useState(false);
    const [deleteUpdate, setDeleteUpdate] = useState(0);
    const [muted, setMuted] = useState(true);
    const [content, setContent] = useState(
        stories.map((x) => {
            return {
                story_id: x.story_id,
                story_content: x.story_image ? x.story_image : x.story_video,
                file_type: x.story_image ? 'photo' : 'video',
                datetime: x.datetime,
                onPress: x.onPress,
                swipeText: x.swipeText,
                finish: 0
            }
        }));

    const [current, setCurrent] = useState(0);

    const progress = useRef(new Animated.Value(0)).current;

    const prevCurrentPage = usePrevious(props.currentPage);

    useEffect(() => {
        let isPrevious = prevCurrentPage > props.currentPage;
        if (isPrevious) {
            setCurrent(content.length - 1);
        } else {
            setCurrent(0);
        }

        let data = [...content];
        data.map((x, i) => {
            if (isPrevious) {
                x.finish = 1;
                if (i == content.length - 1) {
                    x.finish = 0;
                }
            } else {
                x.finish = 0;
            }

        })
        setContent(data)
        start(props.duration);
    }, [props.currentPage]);

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    function isNullOrWhitespace( input ) {
        if (typeof input === 'undefined' || input == null)
            return true;
    
        return input.toString().replace(/\s/g, '').length < 1;
    }

    const prevCurrent = usePrevious(current);

    useEffect(() => {
        if (!isNullOrWhitespace(prevCurrent)) {
            if (current > prevCurrent && content[current - 1].story_content === content[current].story_content) {
                start(props.duration);
            } else if (current < prevCurrent && content[current + 1].story_content === content[current].story_content) {
                start(props.duration);
            }
        }

    }, [current]);
    

    function start(duration) {
        setLoad(false);
        progress.setValue(0);
        startAnimation(duration);
    }

    function startAnimation(duration) {
        Animated.timing(progress, {
            toValue: 1,
            duration,
            useNativeDriver: false
        }).start(({finished}) => {
            if (finished) {
                next();
            }
        });
    }

    function onSwipeUp() {
        if (props.onClosePress) {
            if (deleteUpdate > 0) {
                props.reloadStory();
            }
            props.onClosePress();
        }
        if (content[current].onPress) {
            content[current].onPress();
        }
    }

    function onSwipeDown() {
        if (deleteUpdate > 0) {
            props.reloadStory();
        }
        props?.onClosePress();
    }

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    function next() {
        // check if the next content is not empty
        setLoad(true);
        if (current !== content.length - 1) {
            let data = [...content];
            data[current].finish = 1;
            setContent(data);
            setCurrent(current + 1);
            progress.setValue(0);
        } else {
            // the next content is empty
            close('next');
            if (deleteUpdate > 0) {
                props.reloadStory();
            }
        }
    }

    function previous() {
        // checking if the previous content is not empty
        setLoad(true);
        if (current - 1 >= 0) {
            let data = [...content];
            data[current].finish = 0;
            setContent(data);
            setCurrent(current - 1);
            progress.setValue(0);
        } else {
            // the previous content is empty
            close('previous');
            if (deleteUpdate > 0) {
                props.reloadStory();
            }
        }
    }

    function close(state) {
        let data = [...content];
        data.map(x => x.finish = 0);
        setContent(data);
        progress.setValue(0);
        if (props.currentPage == props.index) {
            if (props.onFinish) {
                props.onFinish(state);
            }
        }
    }

    function delStory() {
        progress.stopAnimation()
        setPressed(true)
        Alert.alert(
            "Delete",
            "Are you sure you want to delete this story?",
            [
              {
                text: "Cancel",
                onPress: () => {
                    startAnimation(props.duration);
                    setPressed(false);
                },
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                  if (props.deleteStory(content[current].story_id)) {
                    const oldCount = current;
                    const filterContent = content.filter(cont => cont.story_id !== content[current].story_id);
                    if (filterContent.length !== oldCount) {
                        setContent(filterContent);
                    } else {
                        props.onClosePress();
                        props.reloadStory();
                    }
                    setDeleteUpdate(deleteUpdate + 1);
                  }
                  startAnimation(props.duration);
                  setPressed(false);
              } }
            ]
        ) 
    }

    function navigateToUserProfile() {
        global.profileID = props.user_id;
        navigation.navigate("ProfileScreen")
    }

    const swipeText = content?.[current]?.swipeText || props.swipeText || 'Swipe Up';
    return (
        <GestureRecognizer
            onSwipeUp={(state) => onSwipeUp(state)}
            onSwipeDown={(state) => onSwipeDown(state)}
            config={config}
            style={{
                flex: 1,
                backgroundColor: 'black'
            }}
        >
            <SafeAreaView>
                <View style={styles.backgroundContainer}>
                    {
                        content[current].file_type === 'photo' && (
                        <Image onLoadEnd={() => start(props.duration)}
                            source={{uri: content[current].story_content}}
                            resizeMode="contain"
                            style={styles.image}
                        />)
                    }
                    {
                        content[current].file_type === 'video' && (
                            <View style={{backgroundColor: '#201E23'}}>
                                <Video
                                    muted={muted}
                                    // onReadyForDisplay={(data) => start(5000)}
                                    onLoad={(data) => start(data.duration * 1000)}
                                    source={{ uri: content[current].story_content }}
                                    resizeMode="contain"
                                    controls
                                    style={{
                                        height: height,
                                        // position: 'absolute',
                                        // top: 0,
                                        // left: 0,
                                        // bottom: 0,
                                        // right: 0,
                                    }}
                                    playInBackground={false}
                                />
                            </View>
                        )
                    }
                    {load && <View style={styles.spinnerContainer}>
                        <ActivityIndicator size="large" color={'white'}/>
                    </View>}
                </View>
            </SafeAreaView>
            <View style={{flexDirection: 'column', flex: 1,}}>
                <View style={styles.animationBarContainer}>
                    {content.map((index, key) => {
                        return (
                            <View key={key} style={styles.animationBackground}>
                                <Animated.View
                                    style={{
                                        flex: current == key ? progress : content[key].finish,
                                        height: 2,
                                        backgroundColor: 'white',
                                    }}
                                />
                            </View>
                        );
                    })}
                </View>
                <View style={styles.userContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity onPress={navigateToUserProfile}>
                            <Image style={styles.avatarImage}
                                source={{uri: props.profileImage}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateToUserProfile}>
                            <Text style={styles.avatarText}>{props.profileName}</Text>
                            <Text style={{fontSize: 12, color: 'white', marginLeft: 10}}>{moment(content[current].datetime).fromNow()}</Text>
                        </TouchableOpacity>
                        {
                            props.user_id === global.userData.user_id && (
                                <TouchableOpacity onPress={delStory} style={{marginLeft: 15}}>
                                    <Text style={{fontSize: 14, color: 'white'}}>Delete</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    {

                        content[current].file_type === 'video' && (<TouchableOpacity onPress={() => setMuted(!muted)}>
                        <View style={styles.closeIconContainer}>
                            <Octicons name={muted ? 'mute' : 'unmute'} size={22} color="white" />
                        </View>
                    </TouchableOpacity>)
                    }
                    <TouchableOpacity onPress={() => {
                        if (props.onClosePress) {
                            props.onClosePress();
                            if (deleteUpdate > 0) {
                                props.reloadStory();
                            }
                        }
                    }}>
                        <View style={styles.closeIconContainer}>
                            {props.customCloseComponent ?
                                props.customCloseComponent :
                                <Icon name='close' size={22} color="white" />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.pressContainer}>
                    <TouchableWithoutFeedback
                        onPressIn={() => progress.stopAnimation()}
                        onLongPress={() => setPressed(true)}
                        onPressOut={() => {
                            setPressed(false);
                            startAnimation(props.duration);
                        }}
                        onPress={() => {
                            if (!pressed && !load) {
                                previous()
                            }
                        }}
                    >
                        <View style={{flex: 1}}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPressIn={() => progress.stopAnimation()}
                        onLongPress={() => setPressed(true)}
                        onPressOut={() => {
                            setPressed(false);
                            startAnimation(props.duration);
                        }}
                        onPress={() => {
                            if (!pressed && !load) {
                                next()
                            }
                        }}
                    >
                        <View style={{flex: 1}}/>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            {/* {content[current].onPress &&
                <TouchableOpacity activeOpacity={1}
                                  onPress={onSwipeUp}
                                  style={styles.swipeUpBtn}>
                    {props.customSwipeUpComponent ?
                        props.customSwipeUpComponent :
                        <>
                            <Text style={{color: 'white', marginTop: 5}}></Text>
                            <Text style={{color: 'white', marginTop: 5}}>{swipeText}</Text>
                        </>
                    }
                </TouchableOpacity>} */}
        </GestureRecognizer>
    )
}


export default StoryListItem;

StoryListItem.defaultProps = {
    duration: 10000
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        // width: width,
        height: height
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    spinnerContainer: {
        zIndex: -100,
        position: "absolute",
        justifyContent: 'center',
        backgroundColor: 'black',
        alignSelf: 'center',
        width: width,
        height: height,
    },
    animationBarContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    animationBackground: {
        height: 2,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(117, 117, 117, 0.5)',
        marginHorizontal: 2,
    },
    userContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    avatarImage: {
        height: 30,
        width: 30,
        borderRadius: 100
    },
    avatarText: {
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 10,
    },
    closeIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15
    },
    pressContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    swipeUpBtn: {
        position: 'absolute',
        right: 0,
        left: 0,
        alignItems: 'center',
        bottom: Platform.OS == 'ios' ? 20 : 50
    }
});
