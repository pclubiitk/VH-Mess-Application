import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Booking {
  [day: string]: {
    [meal: string]: number;
  };
}

const mealPrices: Record<string, number> = {
  breakfast: 30,
  lunch: 60,
  dinner: 50,
};

const weeklyMenu: Record<string, { breakfast: string; lunch: string; dinner: string }> = {
  Monday: {
    breakfast: "Idli with chutney and sambar. Light and healthy South Indian start to the day.",
    lunch: "Rice, sambar, and a side of vegetable curry. Perfect balanced lunch.",
    dinner: "Chapati with kurma and salad. A comforting dinner option.",
  },
  Tuesday: {
    breakfast: "Poha with sev and lemon. Tasty and light Maharashtrian breakfast.",
    lunch: "Rajma Chawal with pickle. Rich protein-packed North Indian meal.",
    dinner: "Paratha with curd and pickle. Simple and wholesome dinner.",
  },
  Wednesday: {
    breakfast: "Upma with coconut chutney. Filling and nutritious breakfast.",
    lunch: "Dal, rice, and a dry vegetable. Classic homestyle lunch.",
    dinner: "Dosa with chutney and sambar. Crispy South Indian delight.",
  },
  Thursday: {
    breakfast: "Bread jam and boiled eggs. Quick and energizing breakfast.",
    lunch: "Fried rice with gobi manchurian. Indo-Chinese favorite.",
    dinner: "Pulao with raita and papad. Mild and flavorful evening meal.",
  },
  Friday: {
    breakfast: "Aloo paratha with butter and curd. Hearty Punjabi breakfast.",
    lunch: "Chole rice with salad. Spicy and satisfying meal.",
    dinner: "Roti with paneer curry. Delicious protein-rich dinner.",
  },
  Saturday: {
    breakfast: "Pongal with sambar and chutney. South Indian classic comfort food.",
    lunch: "Veg biryani with raita. Aromatic and festive meal.",
    dinner: "Poori with bhaji. Crispy and flavorful end to the day.",
  },
  Sunday: {
    breakfast: "Masala dosa with chutney. Spicy and crunchy breakfast special.",
    lunch: "Full thali (rice, dal, sabzi, roti, dessert). Sunday feast.",
    dinner: "Burger with fries and ketchup. Tasty and fun meal to end the week.",
  },
};

const days: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const meals: string[] = ["breakfast", "lunch", "dinner"];

export default function BookingScreen() {
  const [bookings, setBookings] = useState<Booking>({});
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const colorScheme = useTheme().dark; // light | dark
    const mode= !colorScheme ?'light' : 'dark' ;
  const styles = createStyles(mode);

  const toggleMeal = (day: string, meal: string) => {
    setBookings((prev) => {
      const current = prev[day]?.[meal] ?? 0;
      const updated = { ...prev };
      if (!updated[day]) updated[day] = {};
      updated[day][meal] = current === 0 ? 1 : 0;
      return updated;
    });
  };

  const changePeople = (day: string, meal: string, delta: number) => {
    setBookings((prev) => {
      const count = prev[day]?.[meal] ?? 0;
      const newCount = Math.max(1, count + delta);
      const updated = { ...prev };
      if (!updated[day]) updated[day] = {};
      updated[day][meal] = newCount;
      return updated;
    });
  };

  const calculateTotalPrice = () => {
    let total = 0;
    for (const day in bookings) {
      for (const meal in bookings[day]) {
        total += (bookings[day][meal] ?? 0) * mealPrices[meal];
      }
    }
    return total;
  };

  const handleSubmit = () => {
    const total = calculateTotalPrice();
    const selectedData = bookings;
console.log(selectedData);
    Alert.alert("Booking Submitted", `${JSON.stringify(bookings, null, 2)}\nTotal Price: ₹${total}`);
  };


  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <Text style={styles.notice}>
        Book only for this week. Book before 11:59 AM for lunch, 6 PM for dinner, and 6 AM for breakfast.
      </Text>
      <Text style={styles.heading}>Book Your Meals</Text>
      {days.map((day) => (
        <View key={day} style={styles.daySection}>
          <TouchableOpacity onPress={() => setExpandedDay(day === expandedDay ? null : day)}>
            <Text style={styles.dayTitle}>{day}</Text>
          </TouchableOpacity>
          {expandedDay === day && (
            <View style={styles.mealSection}>
              {meals.map((meal) => (
                <View key={meal} style={styles.mealRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mealLabel}>{meal}</Text>
                    <Text style={styles.mealDescription}>{weeklyMenu[day][meal]}</Text>
                    <Text style={styles.mealPrice}>₹{mealPrices[meal]}</Text>
                  </View>
                  <Switch
                    value={(bookings[day]?.[meal] ?? 0) > 0}
                    onValueChange={() => toggleMeal(day, meal)}
                  />
                  {(bookings[day]?.[meal] ?? 0) > 0 && (
                    <View style={styles.counterContainer}>
                      <TouchableOpacity onPress={() => changePeople(day, meal, -1)}>
                        <Text style={styles.counterBtn}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterText}>{bookings[day][meal]}</Text>
                      <TouchableOpacity onPress={() => changePeople(day, meal, 1)}>
                        <Text style={styles.counterBtn}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Price: ₹{calculateTotalPrice()}</Text>
      </View>
      <View style={styles.submitContainer}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
    </View>
  );
}

function createStyles(mode: "light" | "dark") {
  const isDark = mode==="dark"? true : false;
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? "#000" : "#fff",
      flexGrow: 1,
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
      color: isDark ? "#fff" : "#000",
    },
    notice: {
      fontSize: 14,
      marginBottom: 8,
      color: isDark ? "#ffcc00" : "#6200ea",
      textAlign: "center",
    },
    daySection: {
      marginBottom: 12,
      padding: 12,
      backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
      borderRadius: 8,
    },
    dayTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#4fc3f7" : "#6200ea",
    },
    mealSection: {
      marginTop: 10,
    },
    mealRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 6,
    },
    mealLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#eee" : "#333",
    },
    mealDescription: {
      fontSize: 12,
      color: isDark ? "#aaa" : "#555",
      marginBottom: 2,
    },
    mealPrice: {
      fontSize: 13,
      color: isDark ? "#ffb74d" : "#444",
      fontWeight: "bold",
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    counterBtn: {
      fontSize: 20,
      width: 30,
      textAlign: "center",
      color: isDark ? "#fff" : "#000",
    },
    counterText: {
      fontSize: 16,
      width: 30,
      textAlign: "center",
      color: isDark ? "#fff" : "#000",
    },
    totalContainer: {
      marginTop: 20,
      padding: 12,
      backgroundColor: isDark ? "#333" : "#eee",
      borderRadius: 12,
      alignItems: "center",
    },
    totalText: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
    },
    submitContainer: {
      marginTop: 16,
      marginBottom: 50,
    },
  });
}
