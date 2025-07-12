import {StyleSheet, View } from "react-native";
import { SvgUri } from "react-native-svg";
const errorImage = require('@/assets/images/index.svg');
import { Asset } from 'expo-asset';
import { Colors } from "@/constants/Colors";
import { Text } from "react-native";

type ErrorFetchingProps = {
    mode: "light" | "dark";
};

export default function ErrorFetching({ mode }: ErrorFetchingProps) {
    const styles = createStyles(mode);
    return (
        <View style={{ alignItems: "center", marginTop: 40 }}>
            <SvgUri width={150} height={150} uri={Asset.fromModule(errorImage).uri} />
            <Text style={styles.cardHeading}>Sorry, can't fetch current menu</Text>
            <Text style={styles.description}>Please try again later</Text>
        </View>
    );
}

function createStyles(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return StyleSheet.create({
        cardHeading: {
            fontSize: 20,
            color: isDark ? Colors.dark.tint : Colors.light.tint,
            fontFamily: 'Poppins_600SemiBold',
            marginBottom: 4,
        },
        price: {
            color: isDark ? Colors.dark.icon : Colors.light.icon,
            fontWeight: '500',
            fontFamily: 'Inter_400Regular',
            marginBottom: 2,
        },
        desc: {
            color: isDark ? Colors.dark.descColor : Colors.light.descColor,
            fontSize: 13,
            fontFamily: 'Inter_400Regular',
        },
        description: {
            fontSize: 14,
            color: isDark ? Colors.dark.descColor : Colors.light.descColor,
            fontFamily: 'Poppins_400Regular',
            marginTop: 8,
        },
    });
}

