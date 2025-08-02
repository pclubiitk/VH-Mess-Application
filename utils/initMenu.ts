// utils/initMenu.ts

export type MealKey = "Breakfast" | "Lunch" | "Dinner";
export type MealDetails = {
  description: string;
  price: number;
  coupons: number;
  available_coupons: number;

};
export type WeeklyMenu = Record<string, Record<MealKey, MealDetails>>;
export interface DayMeal {
  description: string;
  price: number;
   coupons: number;
     available_coupons: number;
}
export const mealImages = {
  Breakfast: require("@/assets/images/breakfast.jpg"),
  Lunch: require("@/assets/images/lunch.jpg"),
  Dinner: require("@/assets/images/dinner.jpg"),
};

export const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

