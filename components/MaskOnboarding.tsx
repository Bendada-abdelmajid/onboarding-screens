import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle, interpolate, useSharedValue, withTiming, Extrapolation, Easing, interpolateColor, withSpring } from "react-native-reanimated";
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Circle, G, Path } from "react-native-svg";
type ScreenProps = {
  bg: string;
  img: any;
  title: string;
  desc: string;
};
const data: ScreenProps[] = [
  {
    bg: "#F5C634",
    img: require("../assets/images/1.png"),
    title: "Join &\nDesign",
    desc: "Join a design community and meet other creatives",
  },
  {
    bg: "#88D9E0",
    img: require("../assets/images/2.png"),
    title: "Design &\nInspire",
    desc: "Get creative and create designs that inspires others.",
  },
  {
    bg: "#F2D1DC",
    img: require("../assets/images/3.png"),
    title: "Flex Your\nCreativity",
    desc: "Be More Creative and Flex Your Imagination"
  }
];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const btnSize = 65
const MaskOnboarding = () => {
  const active = useSharedValue(0)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} resizeMode="contain" source={require("../assets/images/figma.png")} />
        <Pressable style={styles.skipBtn}>
          <Text style={{ textAlign: "right", fontWeight: "400", fontSize: 16 }}>Skip</Text>
        </Pressable>
      </View>

      {data.map((el, index) => (
        <Item el={el} key={"item-" + index} index={index} active={active} />
      ))}
      {/* <Text>OnboardingTwo</Text> */}
      <Button active={active} />
    </View>
  );
};

export default MaskOnboarding;
type ItemProps = {
  el: ScreenProps;
  index: number;
  active: SharedValue<number>
};
const AnimatedCircel = Animated.createAnimatedComponent(Circle)
const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedButton = Animated.createAnimatedComponent(Pressable)
const Item = ({ el, index, active }: ItemProps) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      r: interpolate(
        active.value,
        [(index - 1), index, (index + 1)],
        [0, SCREEN_HEIGHT, SCREEN_HEIGHT],
        Extrapolation.CLAMP
      )
    }
  })
  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: interpolate(
          active.value,
          [(index - 1), index, (index + 1)],
          [-80, 0, 80],
          Extrapolation.CLAMP
        )
      }]
    }
  })
  return (
    <MaskedView style={[StyleSheet.absoluteFill, { backgroundColor: el.bg }]}
      maskElement={
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>

          <AnimatedCircel cx={SCREEN_WIDTH - 65} cy={SCREEN_HEIGHT - 95} animatedProps={animatedProps} fill="white" />


        </Svg>
      }
    >
      <View style={[styles.screenWrraper]}>
        <Image style={[styles.image, index == 1 && styles.image2]} resizeMode='contain' source={el.img} />
        <Animated.Text style={[styles.title, index == 1 && { marginTop: 50 }, animatedTitleStyle]} >{el.title}</Animated.Text>
        <Text style={styles.desc}>{el.desc}</Text>
      </View>

    </MaskedView>
  );
};

const Button = ({ active, }: { active: SharedValue<number> }) => {

  const length = 500;

  const onPress = () => {
    const current = active?.value ?? 0;
    const isEnd = current >= (data?.length || 0) - 1;
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Data array is empty or undefined.");
      return;
    }

    if (isEnd) {

      active.value = withTiming(0, { duration: 300 });
    } else {

      active.value = withTiming(current + 1, { duration: 300, easing: Easing.ease });
    }

  };

  const animatedProps = (index: number) => useAnimatedProps(() => {
    const el = data[Math.ceil(active.value) || 0]
    const bg = el ? el.bg : "gray"

    return {
      stroke: interpolateColor(
        active.value,
        [(index - 1), index, (index + 1)],
        ["#f1f1f1", bg, bg]
      ),
      strokeDasharray: [length, length],
      strokeDashoffset: interpolate(
        active.value,
        [(index - 1), index, (index + 1)],
        [0, 0, 0]
      )

    }
  }, [active.value])

  const scale = useSharedValue(1);
  const handlePressIn = () => {
    scale.value = withSpring(0.90, { damping: 10 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return <AnimatedButton onPressIn={handlePressIn}
    onPressOut={handlePressOut}
    onPress={onPress} style={[styles.btn, animatedStyle]}>
    <Svg style={styles.pagination} width="51" height="53" viewBox="0 0 51 53" fill="none">
      <AnimatedPath d="M14.3029 49.8681H36.685C42.0128 49.8681 46.5222 46.3023 48.0343 41.388H50.2175C48.6438 47.4968 43.1816 52.0034 36.685 52.0034H14.3029C8.02784 52.0034 2.7178 47.4952 0.944824 41.5896H3.15686C4.84079 46.3133 9.19584 49.8681 14.3029 49.8681Z" strokeWidth="2" strokeLinecap={"round"}
        fill="none"
        animatedProps={animatedProps(2)} />
      {/* <Path d="M48.1275 14.6258C48.1275 7.94318 42.804 2.52585 36.237 2.52585L27.564 2.58686V0.390564H36.237C43.9628 0.390564 50.2258 6.7639 50.2258 14.6258V36.6294H48.1275V14.6258Z" fill={"#f1f1f1"} /> */}

      {/* <Path d="M48.1275 14.6258C48.1275 7.94318 42.804 2.52585 36.237 2.52585L27.564 2.58686V0.390564H36.237C43.9628 0.390564 50.2258 6.7639 50.2258 14.6258V36.6294H48.1275V14.6258Z" fill={"f1f1f1"} /> */}
      <AnimatedPath d="M48.1275 14.6258C48.1275 7.94318 42.804 2.52585 36.237 2.52585L27.564 2.58686V0.390564H36.237C43.9628 0.390564 50.2258 6.7639 50.2258 14.6258V36.6294H48.1275V14.6258Z"

        strokeWidth="2" strokeLinecap={"round"}
        fill="none"
        animatedProps={animatedProps(1)} />
      <AnimatedPath d="M14.2146 2.52585C7.64771 2.52585 2.32415 7.94318 2.32415 14.6258V36.9418H0.22583V14.6258C0.22583 6.7639 6.48883 0.390564 14.2146 0.390564H23.2474V2.52585H14.2146Z" animatedProps={animatedProps(0)} strokeWidth="2" strokeLinecap={"round"}
        fill="none" />
    </Svg>
    <Image source={require("../assets/images/arrow.png")} />
  </AnimatedButton>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"

  },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    width: SCREEN_WIDTH,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
    paddingHorizontal: 25
  },
  logo: {
    width: 40,
    height: 40,
  },
  skipBtn: {
    width: 70

  },
  screenWrraper: {
    flex: 1,
    width: SCREEN_WIDTH,
    position: "absolute",
    inset: 0,
    paddingTop: 120,
  },
  image: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_WIDTH * 0.85,
    marginHorizontal: "auto",
  },
  image2: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: "absolute",
    bottom: -40,
    right: 50,
    transform: [{ scale: 1.45 }, { rotate: "5deg" }],
  },
  title: {
    fontSize: 64,
    marginTop: 30,
    paddingHorizontal: 30,
    fontWeight: "600",
    lineHeight: 70,
    // fontFamily:"Anybody-Medium",
  },
  desc: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "400",
    lineHeight: 25,
    paddingHorizontal: 30,
  },
  btn: {
    width: btnSize,
    height: btnSize,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 25,
    position: "absolute",
    bottom: 70,
    right: 30,
    justifyContent: "center",

    alignItems: "center",
    zIndex: 30
  },
  pagination: {
    position: "absolute"
  }
});
