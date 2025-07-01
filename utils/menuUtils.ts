import AsyncStorage from '@react-native-async-storage/async-storage';
import { dummyMenu } from './initMenu';
import { BASE_URL } from  '@/constants/config';
type MealKey = 'breakfast' | 'lunch' | 'dinner';
type MealDetails = { description: string; price: number };
export type WeeklyMenu = Record<string, Record<MealKey, MealDetails>>;

const MENU_KEY = 'weeklyMenu';
const EXPIRY_KEY = 'weeklyMenuExpiry';
const EXPIRY_DAYS = 3;

export const getWeeklyMenu = async (): Promise<WeeklyMenu> => {
  try {
    const [storedMenu, storedExpiry] = await AsyncStorage.multiGet([
      MENU_KEY,
      EXPIRY_KEY,
    ]);

    const now = Date.now();
    const expiryTime = storedExpiry[1] ? parseInt(storedExpiry[1], 10) : 0;

    if (storedMenu[1] && now < expiryTime) {
      return JSON.parse(storedMenu[1]);
    }

    const freshMenu = await fetchWeeklyMenuFromServer();

    await AsyncStorage.multiSet([
      [MENU_KEY, JSON.stringify(freshMenu)],
      [
        EXPIRY_KEY,
        (now + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toString(),
      ],
    ]);

    return freshMenu;
  } catch (err) {
    console.error('Failed to load weekly menu:', err);
    return {};
  }
};

////

const fetchWeeklyMenuFromServer = async (): Promise<WeeklyMenu> => {
  try {
    const response = await fetch(`${BASE_URL}/api/menu/current`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data as WeeklyMenu;
  } catch (error) {
    console.error('Failed to fetch menu from server:', error);
 
    throw error;
  }
};
