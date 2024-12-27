import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { AntDesign} from '@expo/vector-icons';
import Animated, { Extrapolation, interpolate, interpolateColor, SharedValue, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import LottieView, { AnimationObject } from 'lottie-react-native';
type ScreenProps = {
    title: string;
    bgcolor: string;
    color: string;
    id: string;
    animation: AnimationObject;
}
const { width } = Dimensions.get("window")
const data: ScreenProps[] = [
    {
        id: "1",
        title: "Explore new\ndestinations",
        bgcolor: "#FDE868",
        color: "#000",
        animation: require("../assets/animations/Airplane.json")
    },
    {
        id: "2",
        title: "Mountains\ncalling",
        bgcolor: "#FF71A6",
        color: "#fff",
        animation: require("../assets/animations/Mountain.json")
    },
    {
        id: "3",
        title: "Pack your\nbags",
        bgcolor: "#8CDBEB",
        color: "#000",
        animation: require("../assets/animations/Luggage.json")
    },
]

const AnimatedButton = Animated.createAnimatedComponent(Pressable)
const AnimatedIcon = Animated.createAnimatedComponent(AntDesign)

const Onboarding = () => {
    const scrollX = useSharedValue(0)
    const flatListRef = useAnimatedRef<FlatList>()
    const scrollHundler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        }
    })

    const colors = data.map(el => el.color)
    const animatedButtonBgStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                scrollX.value,
                [0, width, 2 * width],
                colors
            ),
            width: interpolate(
                scrollX.value,
                [0, width, 2 * width],
                [70, 70, 170]
            )
        }
    })
    const animatedColorStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                scrollX.value,
                [0, width, 2 * width],
                colors
            ),
        }
    })
    const animatedButtonTextStyle = useAnimatedStyle(() => {
        return {

            opacity: interpolate(
                scrollX.value,
                [0, width, 2 * width],
                [0, 0, 1]
            )
        }
    })
    const animatedIconStyle= useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                scrollX.value,
                [0, width, 2 * width],
                ["#fff", "#000", "#000"]
            )
        }
    })
    const onPress = () => {
        const nextIndex = Math.ceil(scrollX.value / width) + 1
        if (nextIndex < data.length) {
            flatListRef.current?.scrollToIndex({ animated: true, index: nextIndex })
        } else {
            console.log("navihate to home")
        }
    }
    return (
        <View style={styles.container}>
            <Pressable style={[styles.skipBtn]}>
                <Animated.Text style={[styles.skipBtnText, animatedColorStyle]}>Skip</Animated.Text>
            </Pressable>
            <Animated.FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                overScrollMode='never'
                scrollEventThrottle={16}
                onScroll={scrollHundler}
                renderItem={({ item, index }) => {
                    return <OnboardingItem item={item} index={index} scrollX={scrollX} />
                }}

            />
            <View style={styles.footer}>
                <View style={styles.paggination}>
                    {data.map((el, index) => (
                        <Dot key={"dot" + index} index={index} scrollX={scrollX} colors={colors} />
                    ))}
                </View>
                <AnimatedButton onPress={onPress} style={[styles.btn, animatedButtonBgStyle]}>
                    <AnimatedIcon style={animatedIconStyle} name="arrowright" size={25} />
                    <Animated.Text style={[styles.btnText, animatedButtonTextStyle]}>Get Started</Animated.Text>
                </AnimatedButton>
            </View>
        </View>
    )
}
type OnboardingItemProps = {
    item: ScreenProps,
    index: number,
    scrollX: SharedValue<number>

}


const OnboardingItem = ({ item, index, scrollX }: OnboardingItemProps) => {
    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            transform: [

                {
                    rotate: `${interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [0, 0, 20],
                        Extrapolation.CLAMP
                    )}deg`
                },
                {
                    translateX: `${interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [0, 0, -50],
                        Extrapolation.CLAMP
                    )}%`
                },

            ],

        }
    })
    const animatedCircelStyle = useAnimatedStyle(() => {
        return {
            transform: [

                {
                    scale: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [1, 4, 4],
                        Extrapolation.CLAMP
                    )
                },

            ],

        }
    })
    return <Animated.View style={[styles.screenWrraper]}>
        <Animated.View style={[styles.circel, { backgroundColor: item.bgcolor }, animatedCircelStyle]} />
        <Animated.View style={[styles.imageBox, animatedImageStyle]}>
            <LottieView
                source={item.animation}
                style={{
                    width: width * 0.9,
                    height: width * 0.9,
                }}
                autoPlay
                loop
            />
        </Animated.View>
        <Animated.Text style={[styles.title, { color: item.color }]}>{item.title}</Animated.Text>
    </Animated.View>
}
type DorProps = {
    index: number;
    scrollX: SharedValue<number>;
    colors: string[]
}
const Dot = ({ index, scrollX, colors }: DorProps) => {
    const animatedDotStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                scrollX.value,
                [0, width, 2 * width],
                colors
            ),
            width: interpolate(
                scrollX.value,
                [(index - 1) * width, index * width, (index + 1) * width],
                [10, 25, 10],
                Extrapolation.CLAMP
            )
        }
    })
    return <Animated.View style={[styles.dot, animatedDotStyle]} />
}
export default Onboarding



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    skipBtn:{
        position:"absolute",
        top:50,
        right:30,
        zIndex:20,
    },
    skipBtnText:{
        fontFamily:"Anybody-Regular",
        fontWeight:"300",
        fontSize:16,
    },
    screenWrraper: {
        flex: 1,
        justifyContent: "center",

        padding: 30,
        paddingBottom: 120,
        width

    },
    imageBox: {     
        marginHorizontal: "auto",
        borderRadius: 20,
        zIndex: 2,

    },
    title: {
        fontSize: 40,
        marginTop: 20,
        fontWeight: '600',
        lineHeight:50,
        fontFamily:"Anybody-Medium",
        zIndex: 2
    },
    circel: {
        width,
        height: width * 1.25,
        position: "absolute",
        bottom: 0,
        right: 0,
        borderRadius: "50%"
    },
    footer: {
        width,
        position: "absolute",
        bottom: 80,
        paddingHorizontal: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    paggination: {
        flexDirection: "row",
        gap: 5

    },
    dot: {
        height: 10,
        backgroundColor: "#000",
        borderRadius: 5


    },
    btn: {
        width: 70,
        height: 70,
        backgroundColor: "black",
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center"
    },
    btnText: {
        color: "#fff",
        position: "absolute",
        fontWeight: 400,
        fontSize: 20

    }
})