import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

// Get environment variables
const supabaseUrl = "https://xyzcompany.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2NDExNDMyLCJleHAiOjE5MzE5ODc0MzJ9.dummy-key";

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Mock implementation for demo purposes
const mockUsers = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    nickname: "demo",
    password: "password123",
    email: "demo@example.com",
    email_confirmed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    reset_token: null,
    reset_token_expires: null,
  },
];

// Store the mock users in localStorage for persistence
const storedUsers = localStorage.getItem("mockUsers");
if (storedUsers) {
  try {
    const parsedUsers = JSON.parse(storedUsers);
    // Make sure demo user is always available
    if (!parsedUsers.some((u) => u.email === "demo@example.com")) {
      parsedUsers.push(mockUsers[0]);
    }
    mockUsers.length = 0;
    mockUsers.push(...parsedUsers);
  } catch (e) {
    console.error("Failed to parse stored users", e);
  }
} else {
  // Initialize localStorage with demo user
  localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
}

// Override Supabase methods with mock implementations
const originalFrom = supabase.from;
supabase.from = function (table) {
  const originalSelect = originalFrom(table).select;
  const originalInsert = originalFrom(table).insert;
  const originalUpdate = originalFrom(table).update;

  // Mock implementation
  if (table === "users") {
    return {
      ...originalFrom(table),
      select: function (columns) {
        console.log(`Mock select from ${table}:`, columns);
        return {
          eq: function (column, value) {
            console.log(`Mock eq ${column}=${value}`);
            return {
              limit: function (limit) {
                console.log(`Mock limit ${limit}`);
                if (column === "email") {
                  const filtered = mockUsers.filter(
                    (u) => u.email.toLowerCase() === value.toLowerCase(),
                  );
                  return Promise.resolve({
                    data: filtered.slice(0, limit),
                    error: null,
                  });
                } else if (column === "nickname") {
                  const filtered = mockUsers.filter(
                    (u) => u.nickname === value,
                  );
                  return Promise.resolve({
                    data: filtered.slice(0, limit),
                    error: null,
                  });
                } else if (column === "id") {
                  const filtered = mockUsers.filter((u) => u.id === value);
                  return Promise.resolve({
                    data: filtered.slice(0, limit),
                    error: null,
                  });
                }
                return Promise.resolve({ data: [], error: null });
              },
              single: function () {
                console.log(`Mock single ${column}=${value}`);
                if (column === "email") {
                  const found = mockUsers.find(
                    (u) => u.email.toLowerCase() === value.toLowerCase(),
                  );
                  return Promise.resolve({
                    data: found || null,
                    error: found ? null : { message: "Not found" },
                  });
                } else if (column === "nickname") {
                  const found = mockUsers.find((u) => u.nickname === value);
                  return Promise.resolve({
                    data: found || null,
                    error: found ? null : { message: "Not found" },
                  });
                } else if (column === "id") {
                  const found = mockUsers.find((u) => u.id === value);
                  return Promise.resolve({
                    data: found || null,
                    error: found ? null : { message: "Not found" },
                  });
                }
                return Promise.resolve({
                  data: null,
                  error: { message: "Not found" },
                });
              },
            };
          },
          order: function (column, { ascending }) {
            return Promise.resolve({ data: [...mockUsers], error: null });
          },
          limit: function (limit) {
            return Promise.resolve({
              data: mockUsers.slice(0, limit),
              error: null,
            });
          },
        };
      },
      insert: function (rows) {
        console.log(`Mock insert into ${table}:`, rows);
        const newUser = {
          id: `550e8400-e29b-41d4-a716-${Math.floor(Math.random() * 1000000000)
            .toString()
            .padStart(9, "0")}}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...rows[0],
        };

        // Check if email already exists
        const emailExists = mockUsers.some(
          (u) => u.email.toLowerCase() === newUser.email.toLowerCase(),
        );
        if (emailExists) {
          return {
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: { message: "Email already exists" },
                }),
            }),
          };
        }

        // Check if nickname already exists
        const nicknameExists = mockUsers.some(
          (u) => u.nickname === newUser.nickname,
        );
        if (nicknameExists) {
          return {
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: { message: "Nickname already exists" },
                }),
            }),
          };
        }

        mockUsers.push(newUser);
        // Update localStorage
        localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
        console.log("Updated mock users:", mockUsers);

        return {
          select: function (columns) {
            return {
              single: function () {
                return Promise.resolve({ data: newUser, error: null });
              },
            };
          },
        };
      },
      update: function (updates) {
        console.log(`Mock update ${table}:`, updates);
        return {
          eq: function (column, value) {
            if (column === "id") {
              const userIndex = mockUsers.findIndex((u) => u.id === value);
              if (userIndex >= 0) {
                mockUsers[userIndex] = {
                  ...mockUsers[userIndex],
                  ...updates,
                  updated_at: new Date().toISOString(),
                };
                // Update localStorage
                localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
                console.log(`Updated user:`, mockUsers[userIndex]);
                return Promise.resolve({
                  data: mockUsers[userIndex],
                  error: null,
                });
              }
            }
            return Promise.resolve({ data: null, error: null });
          },
        };
      },
    };
  }

  // For other tables, return a mock that doesn't error
  return {
    ...originalFrom(table),
    select: function (columns) {
      console.log(`Mock select from ${table}:`, columns);
      return {
        eq: function (column, value) {
          return {
            limit: function (limit) {
              return Promise.resolve({ data: [], error: null });
            },
            single: function () {
              return Promise.resolve({ data: null, error: null });
            },
          };
        },
        limit: function (limit) {
          return Promise.resolve({ data: [], error: null });
        },
      };
    },
    insert: function (rows) {
      console.log(`Mock insert into ${table}:`, rows);
      return {
        select: function () {
          return {
            single: function () {
              return Promise.resolve({ data: rows[0], error: null });
            },
          };
        },
      };
    },
    update: function (updates) {
      console.log(`Mock update ${table}:`, updates);
      return {
        eq: function () {
          return Promise.resolve({ data: null, error: null });
        },
      };
    },
    upsert: function (rows) {
      console.log(`Mock upsert into ${table}:`, rows);
      return Promise.resolve({ data: rows[0], error: null });
    },
  };
};

console.log("Mock Supabase client initialized with demo user:", mockUsers[0]);
