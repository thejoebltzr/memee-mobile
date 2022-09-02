import React, {Fragment, useRef, useState, useEffect} from "react";
import {Dimensions, View, Platform} from "react-native";
import Modal from "react-native-modalbox";
import AndroidCubeEffect from "./AndroidCubeEffect";
import CubeNavigationHorizontal from "./CubeNavigationHorizontal";
import StoryListItem from "./StoryListItem";
import StoryList from "./StoryList";

export const Story = props => {
    const {
        onClose,
        duration,
        swipeText,
        customSwipeUpComponent,
        customCloseComponent,
        stories,
        deleteStory,
        reloadStory,
        updateOffset,
        storyOffset,
        storyPage,
        storyLimit,
        setAddStoryModalVisible
    } = props;

    const [dataState, setDataState] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedData, setSelectedData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(0);
    const cube = useRef();

    useEffect(() => {
        setSelectedData(stories)
    }, [])

    function move(from, to, arr) {
        const newArr = [...arr];
        const item = newArr.splice(from, 1)[0];
        newArr.splice(to, 0, item);
        return newArr;
    }

    const _handleStoryItemPress = (item, index) => {
        setCurrentPage(0);
        setModalOpen(true);
        setSelectedItem(index)
    };


    function isNullOrWhitespace( input ) {
        if (typeof input === 'undefined' || input == null)
            return true;
    
        return input.toString().replace(/\s/g, '').length < 1;
    }

    function onStoryFinish(state) {
        if (!isNullOrWhitespace(state)) {
            if (state == "next") {
                const newPage = currentPage + 1;
                if (newPage < selectedData.length) {
                    setCurrentPage(newPage);
                    cube?.current?.scrollTo(newPage);
                } else {
                    setModalOpen(!isModalOpen);
                    setCurrentPage(0);
                    if (onClose) {
                        onClose(selectedData[selectedData.length - 1]);
                    }
                }
            } else if (state == "previous") {
                const newPage = currentPage - 1;
                if (newPage < 0) {
                    setModalOpen(!isModalOpen);
                    setCurrentPage(0);
                } else {
                    setCurrentPage(newPage);
                    cube?.current?.scrollTo(newPage);
                }
            }
        }
    }

    const reOrderList = () => {
        if (selectedData.length) {
            const newArr = move(selectedItem, 0, selectedData);
            return newArr.map((x, i) => {
                return (<StoryListItem duration={duration * 1000}
                            key={i}
                            profileName={x.user_name}
                            profileImage={x.user_image}
                            stories={x.stories}
                            user_id={x.user_id}
                            deleteStory={deleteStory}
                            reloadStory={reloadStory}
                            currentPage={currentPage}
                            onFinish={onStoryFinish}
                            swipeText={swipeText}
                            customSwipeUpComponent={customSwipeUpComponent}
                            customCloseComponent={customCloseComponent}
                            onClosePress={() => {
                                setModalOpen(!isModalOpen);
                                if (onClose) {
                                    onClose(x);
                                }
                            }}
                            index={i}
                        />)
            })
        }
    }

    const renderStoryList = () => reOrderList();

    const renderCube = () => {
        if (Platform.OS == 'ios') {
            return (
                <CubeNavigationHorizontal
                    ref={cube}
                    callBackAfterSwipe={(x) => {
                        if (x != currentPage) {
                            setCurrentPage(parseInt(x));
                        }
                    }}
                >
                    {renderStoryList()}
                </CubeNavigationHorizontal>
            )
        } else {
            return (<AndroidCubeEffect
                ref={cube}
                callBackAfterSwipe={(x) => {
                    if (x != currentPage) {
                        setCurrentPage(parseInt(x));
                    }
                }}
            >
                {renderStoryList()}
            </AndroidCubeEffect>)
        }
    }

    return (
        <Fragment>
            {
                <StoryList
                    handleStoryItemPress={_handleStoryItemPress}
                    data={selectedData}
                    updateOffset={updateOffset}
                    storyOffset={storyOffset}
                    storyPage={storyPage}
                    storyLimit={storyLimit}
                    setAddStoryModalVisible={setAddStoryModalVisible}
                />
            }
            <Modal
                style={{
                    flex: 1,
                    height: Dimensions.get("window").height,
                    width: Dimensions.get("window").width
                }}
                isOpen={isModalOpen}
                onClosed={() => setModalOpen(false)}
                position="center"
                swipeToClose
                swipeArea={250}
                backButtonClose
                coverScreen={true}
            >
                {renderCube()}
            </Modal>
        </Fragment>
    );
};
export default Story;

Story.defaultProps = {
    showAvatarText: true
}
