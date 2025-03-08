import { supabase } from "./supabase";

// App usage tracking functions
export const saveAppUsage = async (
  userId: string,
  appId: string,
  usageTime: number,
) => {
  const { data, error } = await supabase.from("app_usage").insert([
    {
      user_id: userId,
      app_id: appId,
      usage_time: usageTime,
      timestamp: new Date().toISOString(),
    },
  ]);

  if (error) console.error("Error saving app usage:", error);
  return data;
};

export const getAppUsageStats = async (userId: string, days: number = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("app_usage")
    .select("*")
    .eq("user_id", userId)
    .gte("timestamp", startDate.toISOString());

  if (error) console.error("Error fetching app usage stats:", error);
  return data || [];
};

// App configuration functions
export const saveAppConfig = async (
  userId: string,
  appId: string,
  config: {
    threshold_minutes?: number;
    notification_level?: string;
    custom_messages?: string[];
  },
) => {
  const { data, error } = await supabase.from("app_config").upsert(
    [
      {
        user_id: userId,
        app_id: appId,
        threshold_minutes: config.threshold_minutes,
        notification_level: config.notification_level,
        custom_messages: config.custom_messages,
      },
    ],
    { onConflict: "user_id,app_id" },
  );

  if (error) console.error("Error saving app config:", error);
  return data;
};

export const getAppConfig = async (userId: string, appId: string) => {
  const { data, error } = await supabase
    .from("app_config")
    .select("*")
    .eq("user_id", userId)
    .eq("app_id", appId)
    .single();

  if (error && error.code !== "PGRST116")
    console.error("Error fetching app config:", error);
  return data;
};

// User settings functions
export const saveUserSettings = async (
  userId: string,
  settings: {
    quiet_hours_enabled?: boolean;
    quiet_hours_start?: string;
    quiet_hours_end?: string;
  },
) => {
  const { data, error } = await supabase.from("user_settings").upsert(
    [
      {
        user_id: userId,
        quiet_hours_enabled: settings.quiet_hours_enabled,
        quiet_hours_start: settings.quiet_hours_start,
        quiet_hours_end: settings.quiet_hours_end,
      },
    ],
    { onConflict: "user_id" },
  );

  if (error) console.error("Error saving user settings:", error);
  return data;
};

export const getUserSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116")
    console.error("Error fetching user settings:", error);
  return data;
};

// User management functions
export const getUserByNickname = async (nickname: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("nickname", nickname)
    .single();

  if (error && error.code !== "PGRST116")
    console.error("Error fetching user by nickname:", error);
  return data;
};

export const createUser = async (
  nickname: string,
  password: string,
  email: string = "",
) => {
  const userData = {
    nickname,
    password,
    ...(email ? { email, email_confirmed: false } : {}),
  };

  console.log("Creating user with data:", userData);

  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    throw error;
  }
  return data;
};

export const updateUserNickname = async (userId: string, nickname: string) => {
  const { data, error } = await supabase
    .from("users")
    .update({ nickname })
    .eq("id", userId)
    .select()
    .single();

  if (error) console.error("Error updating user nickname:", error);
  return data;
};
