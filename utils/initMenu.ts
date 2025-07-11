// utils/initMenu.ts

export type MealKey = 'Breakfast' | 'Lunch' | 'Dinner';

export interface DayMeal {
  description: string;
  price: number;
}

export const dummyMenu: Record<string, Record<MealKey, DayMeal>> = {
  Monday: {
    Breakfast: {
      description: "Idli with coconut chutney and sambar.",
      price: 40,
    },
    Lunch: {
      description: "Rice with rasam, curry, and curd.",
      price: 70,
    },
    Dinner: {
      description: "Chapati with veg kurma.",
      price: 60,
    },
  },
  Tuesday: {
    Breakfast: {
      description: "Poha with lemon and peanuts.",
      price: 35,
    },
    Lunch: {
      description: "Rajma rice and salad.",
      price: 75,
    },
    Dinner: {
      description: "Paratha with curd and pickle.",
      price: 65,
    },
  },
  Wednesday: {
    Breakfast: {
      description: "Aloo paratha with butter.",
      price: 45,
    },
    Lunch: {
      description: "Paneer curry with naan.",
      price: 80,
    },
    Dinner: {
      description: "Tomato rice with chips.",
      price: 60,
    },
  },
  Thursday: {
    Breakfast: {
      description: "Uttapam with sambar and chutney.",
      price: 40,
    },
    Lunch: {
      description: "Dal fry with jeera rice.",
      price: 70,
    },
    Dinner: {
      description: "Veg biryani with raita.",
      price: 75,
    },
  },
  Friday: {
    Breakfast: {
      description: "Bread butter and boiled egg.",
      price: 35,
    },
    Lunch: {
      description: "Chole bhature and salad.",
      price: 80,
    },
    Dinner: {
      description: "Dosa with potato masala.",
      price: 60,
    },
  },
  Saturday: {
    Breakfast: {
      description: "Cornflakes with milk.",
      price: 30,
    },
    Lunch: {
      description: "Mixed veg with rice and papad.",
      price: 70,
    },
    Dinner: {
      description: "Pulao with veg curry.",
      price: 65,
    },
  },
  Sunday: {
    Breakfast: {
      description: "Pancakes with honey and banana.",
      price: 50,
    },
    Lunch: {
      description: "Special thali with curries, rice, dessert.",
      price: 90,
    },
    Dinner: {
      description: "Chinese noodles and spring roll.",
      price: 85,
    },
  },
};
