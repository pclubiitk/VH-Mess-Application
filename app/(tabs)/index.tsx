import { Colors } from '@/constants/Colors';
import { MealKey, MealDetails, mealImages } from '@/utils/initMenu';
import { getWeeklyMenu } from '@/utils/menuUtils';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ErrorFetching from '@/components/ErrorFetching';

export default function HomeScreen(): React.ReactElement {
  const colorScheme = useTheme().dark;
  const mode = colorScheme ? 'dark' : 'light';
  const styles = useMemo(() => createStyles(mode), [mode]);
  const router = useRouter();

  const [todayMeals, setTodayMeals] = useState<Record<MealKey, MealDetails> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTodayMeals();
  }, []);

  const loadTodayMeals = async () => {
    try {
      setLoading(true);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const menu = await getWeeklyMenu();
      menu ? setTodayMeals(menu[today as keyof typeof menu]) : setTodayMeals(null);
    } catch (error) {
      console.error('Error loading menu in HomeScreen:', error);
      setTodayMeals(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large"/>
        <Text style={{ marginTop: 16, color: Colors[mode].text }}>Loading today's menu...</Text>
      </View>
    );
  }

  if (!todayMeals || Object.keys(todayMeals).length === 0) {
    return (<ErrorFetching mode={mode} callback={loadTodayMeals} />);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {(Object.keys(todayMeals) as MealKey[]).map((mealKey, idx) => (
          <View key={idx} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardHeading}>{mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}</Text>
              <Text style={styles.price}>₹{todayMeals[mealKey].price}</Text>
              <Text style={styles.desc}>{todayMeals[mealKey].description}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(tabs)/booking')}
              >
                <Text style={styles.buttonText}>Book Now →</Text>
              </TouchableOpacity>
            </View>
            <Image source={mealImages[mealKey]} style={styles.image} />
          </View>
        ))}

        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardHeading, { textAlign: 'center' }]}>Plan Ahead for Your Meals</Text>
            <Text style={[styles.description, { textAlign: 'center' }]}>
              You can book breakfast, lunch, or dinner in advance for any day of the week.
              Avoid last-minute hassle and ensure availability!
            </Text>
            <TouchableOpacity
              style={styles.fullButton}
              onPress={() => router.push('/(tabs)/booking')}
            >
              <Text style={styles.buttonText}>Book for Other Days</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


function createStyles(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      paddingHorizontal: 16,
      backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
    },
    heading: {
      fontSize: 28,
      marginBottom: 16,
      textAlign: 'center',
      color: isDark ? Colors.dark.text : Colors.light.text,
      fontFamily: 'Poppins_600SemiBold',
    },
    card: {
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.dark.card : Colors.light.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: Colors.dark.cardShadow,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 3,
    },
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
    button: {
      marginTop: 10,
      backgroundColor: isDark ? Colors.dark.gray333 : Colors.light.grayeee,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    fullButton: {
      marginTop: 12,
      backgroundColor: isDark ? Colors.dark.gray333 : Colors.light.grayeee,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: isDark ? Colors.dark.text : Colors.light.text,
      fontSize: 14,
      fontFamily: 'Poppins_600SemiBold',
    },
    image: {
      width: 90,
      height: 100,
      borderRadius: 10,
      marginLeft: 12,
    },
  });
}
