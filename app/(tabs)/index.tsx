import { Colors } from '@/constants/Colors';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type Meal = {
  type: string;
  price: string;
  items: string;
  time: string;
  image: any;
};

const meals: Meal[] = [
  {
    type: 'Breakfast',
    price: '40',
    items: 'Idli, Vada, Sambar, Chutney',
    time: 'Book before 9:00 AM',
    image: require('../../assets/images/breakfast.jpg'),
  },
  {
    type: 'Lunch',
    price: '80',
    items: 'Chicken Biryani, Raita',
    time: 'Book before 12:00 PM',
    image: require('../../assets/images/lunch.jpg'),
  },
  {
    type: 'Dinner',
    price: '65',
    items: 'Paneer Tikka Masala, Naan',
    time: 'Book before 7:00 PM',
    image: require('../../assets/images/dinner.jpg'),
  },
];


export default function HomeScreen(): React.ReactElement {
  const colorScheme = useTheme().dark; // light | dark
  const mode= !colorScheme ?'light' : 'dark' ;
  const styles = React.useMemo(() => createStyles(mode), [mode]);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today's Menu</Text>
    <View  >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {meals.map((meal, idx) => (
          <View key={idx} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealType}>{meal.type}</Text>
              <Text style={styles.price}>₹{meal.price}</Text>
              <Text style={styles.desc}>{meal.items}</Text>
              <Text style={styles.time}>{meal.time}</Text>
              <TouchableOpacity style={styles.button} onPress={()=>{router.push('/(tabs)/booking')}}>
                <Text style={styles.buttonText}>Book Now →</Text>
              </TouchableOpacity>
            </View>
            <Image source={meal.image} style={styles.image} />
          </View>
        ))}

        <TouchableOpacity style={styles.fullButton} onPress={()=>{
              router.push('/(tabs)/booking')
        }}>
          <Text style={styles.buttonText}>Book for Other Days</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </View>
  );
}

function createStyles(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';


  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:20,
      paddingHorizontal: 16,
      backgroundColor: isDark ? Colors.dark.background: Colors.light.background,
    },
    heading: {
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 14,
      textAlign: 'center',
      color: isDark ? Colors.dark.text: Colors.light.text,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1e293b' : '#f3f4f6', // slate-800 or gray-100
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: isDark ? '#000' : '#000',
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 3,
    },
    mealType: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? Colors.dark.tint: Colors.light.tint,
    },
    price: {
      color: isDark ? Colors.dark.icon: Colors.light.icon,
      marginTop: 4,
      fontWeight: '500',
    },
    desc: {
      color: isDark ? '#cbd5e1' : '#475569', // slate-300 or slate-600
      marginTop: 4,
    },
    time: {
      color: isDark ? '#94a3b8' : '#64748b', // slate-400 or slate-500
      marginTop: 4,
    },
    button: {
      marginTop: 10,
      backgroundColor: isDark ? '#334155' : '#e5e7eb', // slate-700 or gray-200
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    fullButton: {
      marginTop: 8,
      backgroundColor: isDark ? '#334155' : '#e5e7eb',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: isDark ? Colors.dark.text: Colors.light.text,
      fontSize: 14,
    },
    image: {
      width: 90,
      height: 100,
      borderRadius: 10,
      marginLeft: 12,
    },
  });
}
