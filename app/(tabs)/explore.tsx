import { Colors } from '@/constants/Colors';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
const weeklyMenu = {
  Monday: {
    breakfast:
      'Idli with coconut chutney and piping-hot sambar made from fresh veggies.',
    lunch:
      'Steamed rice served with traditional South-Indian sambar and a side of mixed-veg poriyal.',
    dinner:
      'Soft chapatis paired with mildly spiced kurma cooked in a creamy coconut base.',
  },
  Tuesday: {
    breakfast:
      'Poha tempered with mustard seeds, peanuts, and a hint of lemon for freshness.',
    lunch:
      'Rajma simmered for hours in a tomato-onion gravy, served with fragrant basmati rice.',
    dinner:
      'Flaky paratha with chilled homemade curd and a dash of pickle.',
  },

};



export default function ExploreScreen() {
  const colorScheme = useTheme().dark; // light | dark
  const mode= !colorScheme ?'light' : 'dark' ;
  const styles = React.useMemo(() => createStyles(mode), [mode]);

  return (
    <View style={styles.container}>
    <Text style={styles.heading}>Weekly Menu</Text>

      <View style={{ flex: 1}}>
    <ScrollView showsVerticalScrollIndicator={false}  >
     

      {Object.entries(weeklyMenu).map(([day, meals]) => (
        <View key={day} style={styles.card}>
          <Text style={styles.day}>{day}</Text>

          {(['breakfast', 'lunch', 'dinner'] as const).map((mealKey, idx) => (
            <React.Fragment key={mealKey}>
              <View style={styles.row}>
                <Text style={styles.label}>
                  {mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}
                </Text>
                <Text style={styles.desc}>{meals[mealKey]}</Text>
              </View>
              {idx < 2 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      ))}
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
          paddingHorizontal: 16,
          backgroundColor: isDark ? Colors.dark.background: Colors.light.background,
          paddingTop:20,
        },
    heading: {
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 14,
      textAlign: 'center',
      color: isDark ? '#fff' : '#000',
    },
    card: {
      backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
      borderRadius: 12,
      padding: 18,
      marginBottom: 16,
      shadowColor: isDark ? '#fff' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    day: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 10,
      color: isDark ? '#8ec9ff' : '#5b2dff',
    },
   
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    label: {
      width: 90, 
      fontWeight: '600',
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
    desc: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#d0d0d0' : '#333',
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? '#333' : '#e0e0e0',
      marginVertical: 8,
    },
  });
}
