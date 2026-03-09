import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { Database } from "./database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) =>
        Platform.OS === "web"
          ? localStorage.getItem(key)
          : SecureStore.getItemAsync(key),
      setItem: (key, value) => {
        if (Platform.OS === "web") localStorage.setItem(key, value);
        else SecureStore.setItemAsync(key, value);
      },
      removeItem: (key) => {
        if (Platform.OS === "web") localStorage.removeItem(key);
        else SecureStore.deleteItemAsync(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
