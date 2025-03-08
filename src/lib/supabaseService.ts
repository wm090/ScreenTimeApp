import { supabase } from "./supabase";

// App usage tracking functions
export const saveAppUsage = async (
  userId: string,
  appId: string,
  usageTime: number,
) => {
  const { data, error } = await supabase
    .from("app_usage")
    .insert([
      {
        user_id: userId,
        app_id: appId,
        usage_time: usageTime,
        timestamp: new Date(),
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
  config: any,
) => {
  const { data, error } = await supabase
    .from("app_config")
    .upsert([{ user_id: userId, app_id: appId, ...config }]);

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
export const saveUserSettings = async (userId: string, settings: any) => {
  const { data, error } = await supabase
    .from("user_settings")
    .upsert([{ user_id: userId, ...settings }]);

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
