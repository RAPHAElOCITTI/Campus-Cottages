interface iAppProps {
  name: string;
  title: string;
  imageUrl: string;
  description: string;
  id: number;
}

export interface RoomCategoryType {
  name: string;
  title: string;
  description: string;
  id: number;
  imageUrl: string;
}

export const roomCategoryItems: RoomCategoryType[] = [
  {
    id: 0,
    name: "shared",
    title: "Shared Room",
    description: "Multiple beds in a single room, shared accommodation",
    imageUrl: "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//shared.png",
  },
  {
    id: 1,
    name: "single",
    title: "Single Room",
    description: "Private room with one bed",
    imageUrl: "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//single.png",
  },
  {
    id: 2,
    name: "deluxe",
    title: "Deluxe Room",
    description: "Premium room with enhanced facilities",
    imageUrl: "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//discount.png",
  }
];

export const categoryItems: iAppProps[] = [
  {
    id: 0,
    name: "Wifi",
    description: "This Property has Wifi.",
    title: "Wifi",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//wifi.jpg",
  },
  {
    id: 1,
    name: "trending",
    description: "This is a Property which is trending.",
    title: "Trending",
    imageUrl:
      "https://a0.muscache.com/pictures/3726d94b-534a-42b8-bca0-a0304d912260.jpg",
  },
  {
    id: 2,
    name: "Close to Campus",
    description: "This is a Property is close to Campus",
    title: "Near Campus",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//degree.png",
  },
  {
    id: 3,
    name: "shared",
    description: "This Property is to be shared",
    title: "Shared Rooms",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//shared.png",
  },
  {
    id: 4,
    name: "single",
    description: "This Property is for a single",
    title: "Single Rooms",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//single.png",
  },
  {
    id: 5,
    name: "fullboard",
    description: "This property has full Board Options",
    title: "Full-board options",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//fullboard.png",
  },
  {
    id: 6,
    name: "GymAccess",
    description: "This property has gym access ",
    title: "Gym Access",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//gym.jpeg",
  },
  {
    id: 7,
    name: "heater",
    description: "This property a water heater",
    title: "Water Heater",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//heater.png",
  },
  {
    id: 8,
    name: "sport",
    description: "This property is has a sports Facility",
    title: "Sports Facilities",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//sport.png",
  },
  {
    id: 9,
    name: "discount",
    description: "This Property offers student discounts",
    title: "Student Discounts",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//discount.png",
  },

  
  {
    id: 10,
    name: "security",
    description: "This Property is located on the countryside",
    title: "24/7 Reception Security",
    imageUrl:
      "https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images//security.png",
  },

  /*
  {
    id: 11,
    name: "omg",
    description: "This Property has a wow factor",
    title: "WOW!",
    imageUrl:
      "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg",
  },
  {
    id: 12,
    name: "surfing",
    description: "This Property is located near to a surfing spot",
    title: "Surfing",
    imageUrl:
      "https://a0.muscache.com/pictures/957f8022-dfd7-426c-99fd-77ed792f6d7a.jpg",
  },
];*/]