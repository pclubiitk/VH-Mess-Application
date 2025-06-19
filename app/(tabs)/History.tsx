import { Colors } from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, Text, FlatList, StyleSheet, useColorScheme } from "react-native";

type Meal = {
  id: string;
  date: string;
  meal: string;
  cost: number;
};

export default function History() {
  const colorScheme = useTheme().dark; // light | dark
    const mode= !colorScheme ?'light' : 'dark' ;

  const data: Meal[] = [
    { id: "M001", date: "2025‑06‑16", meal: "Breakfast", cost: 45 },
    { id: "M002", date: "2025‑06‑16", meal: "Dinner", cost: 80 },
    { id: "M003", date: "2025‑06‑15", meal: "Lunch", cost: 65 },
    { id: "M004", date: "2025‑06‑15", meal: "Snack", cost: 30 },
    { id: "M005", date: "2025‑06‑14", meal: "Dinner", cost: 75 },
    { id: "M006", date: "2025‑06‑14", meal: "Dinner", cost: 75 },
  ];

  const styles = createStyles(mode);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking History</Text>
      <FlatList showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.meal}>{item.meal}</Text>
              <Text style={styles.cost}>₹{item.cost}</Text>
            </View>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.id}>ID: {item.id}</Text>
          </View>
        )}
      />
    </View>
  );
}

function createStyles(mode: "dark" | "light") {
  const isDark = mode === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.dark.background: Colors.light.background,
      paddingTop:20,
    },
    listContent: {
      padding: 16,
    },
    heading: {
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 14,
      textAlign: 'center',
      color: isDark ? Colors.dark.text: Colors.light.text,
    },
    card: {
      backgroundColor: isDark ? '#1e293b' : '#f3f4f6', 
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,

      shadowColor: isDark ? "#fff" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 3.6,
      elevation: 3,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    meal: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#fff" : "#000",
    },
    cost: {
      fontSize: 16,
      fontWeight: "700",
      color: isDark ? "#90ee90" : "#2e7d32",
    },
    date: {
      marginTop: 4,
      fontSize: 14,
      color: isDark ? "#aaa" : "#555",
    },
    id: {
      marginTop: 2,
      fontSize: 12,
      color: isDark ? "#666" : "#777",
    },
  });
}
