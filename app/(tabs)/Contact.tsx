import { Colors } from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for icons

export default function ContactScreen() {
  const colorScheme = useTheme().dark;
  const mode = colorScheme ? "dark" : "light";

  const styles = useMemo(() => createStyles(mode), [mode]);
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      
         <text style={styles.cardHeading}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio sit suscipit ipsa, obcaecati, ullam tenetur at dolorum mollitia culpa dolore minima. Doloremque, temporibus odio in eos numquam deleniti praesentium magnam.
        </text>

      <View style={styles.card}>
        {/* <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>VH Mess</Text> */}
     

        <Text style={styles.label}>Email</Text>
        <View style={styles.row}>
          <Ionicons name="mail" size={20} color={styles.iconColor.color} />
          <Text style={styles.value}>vh_dining@iitk.ac.in</Text>
        </View>

        <Text style={styles.label}>Phone</Text>
        <View style={styles.row}>
          <Ionicons name="call" size={20} color={styles.iconColor.color} />
          <Text style={styles.value}>0512-259-7246</Text>
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
      marginTop: 12,
    },
    value: {
      fontSize: 16,
      fontFamily: "Poppins_600SemiBold",
      color: isDark ? "#fff" : "#000",
      marginTop: 4,
      marginLeft: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },
    iconColor: {
      color: isDark ? Colors.dark.tint : Colors.light.tint,
    },
  });
}
