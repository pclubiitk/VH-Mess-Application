import { Colors } from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for icons
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/constants/config";

export default function ContactScreen() {
  const colorScheme = useTheme().dark;
  const mode = colorScheme ? "dark" : "light";

  const styles = useMemo(() => createStyles(mode), [mode]);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.row}>
          For any queries and cancellation of the bookings, Contact:
        </Text>
        <View style={styles.row}>
          <View style={styles.row}>
            <Ionicons name="mail" size={20} color={styles.iconColor.color} />
            <Text
              style={styles.value}
              onPress={() => {
                Linking.openURL(`mailto:${CONTACT_EMAIL}`);
              }}
              selectable
            >
              {CONTACT_EMAIL}
            </Text>
          </View>

          <Text style={styles.label}>Email</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.row}>
            <Ionicons name="call" size={20} color={styles.iconColor.color} />
            <Text
              style={styles.value}
              onPress={() => {
                Linking.openURL(`tel:${CONTACT_PHONE}`);
              }}
              selectable
            >
              {CONTACT_PHONE}
            </Text>
          </View>

          <Text style={styles.label}>Phone</Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
      backgroundColor: isDark
        ? Colors.dark.background
        : Colors.light.background,
    },
    cardHeading: {
      fontSize: 20,
      color: isDark ? Colors.dark.tint : Colors.light.tint,
      fontFamily: "Poppins_600SemiBold",
      marginBottom: 12,
    },
    card: {
      backgroundColor: isDark ? "#1e1e1e" : "#f4f4f4",
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    label: {
      fontSize: 14,
      fontFamily: "Poppins_500Medium",
      color: isDark ? "#bbb" : "#555",
    },
    value: {
      fontSize: 16,
      fontFamily: "Poppins_600SemiBold",
      color: isDark ? "#fff" : "#000",
      marginLeft: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      justifyContent: "space-between",
    },
    iconColor: {
      color: isDark ? Colors.dark.tint : Colors.light.tint,
    },
  });
}
