import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { supabase } from "../../lib/supabase";
import { createUser, getUserByNickname } from "../../lib/supabaseService";

const SupabaseSetupStoryboard = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testNickname, setTestNickname] = useState("TestUser");
  const [testPassword, setTestPassword] = useState("password123");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("count")
        .limit(1);
      setIsConnected(error ? false : true);
      if (error) throw error;
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      // This is a simplified approach - in a real app you'd query information_schema
      const tables = ["users", "app_usage", "app_config", "user_settings"];

      // Check if tables exist by trying to query them
      const tableChecks = await Promise.all(
        tables.map(async (table) => {
          const { error } = await supabase.from(table).select("count").limit(1);
          return { table, exists: !error };
        }),
      );

      setTables(tableChecks.filter((t) => t.exists).map((t) => t.table));
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUser = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      // Check if user already exists
      const existingUser = await getUserByNickname(testNickname);

      if (existingUser) {
        setMessage(`User with nickname "${testNickname}" already exists.`);
      } else {
        const newUser = await createUser(
          testNickname,
          testPassword,
          `${testNickname.toLowerCase()}@example.com`,
        );
        if (newUser) {
          setMessage(
            `Created new user: ${newUser.nickname} with ID: ${newUser.id}`,
          );
          await fetchUsers(); // Refresh user list
        } else {
          setMessage("Failed to create user.");
        }
      }
    } catch (error) {
      console.error("Error creating test user:", error);
      setMessage("Error creating test user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Status:{" "}
              {isLoading
                ? "Checking..."
                : isConnected === null
                  ? "Unknown"
                  : isConnected
                    ? "Connected"
                    : "Not Connected"}
            </p>
            <Button
              onClick={checkConnection}
              disabled={isLoading}
              className="mr-2"
            >
              Check Connection
            </Button>
          </CardContent>
        </Card>

        {/* Tables Card */}
        <Card>
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchTables} disabled={isLoading} className="mb-4">
              {isLoading ? "Loading..." : "Fetch Tables"}
            </Button>

            {tables.length > 0 ? (
              <div className="mt-4">
                <p className="font-medium mb-2">Available Tables:</p>
                <ul className="list-disc pl-5">
                  {tables.map((table) => (
                    <li key={table}>{table}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No tables found or not fetched yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Test User Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Test User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testNickname}
                  onChange={(e) => setTestNickname(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Enter nickname"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Enter password"
                />
                <Button
                  onClick={createTestUser}
                  disabled={
                    isLoading || !testNickname.trim() || !testPassword.trim()
                  }
                >
                  {isLoading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              >
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchUsers} disabled={isLoading} className="mb-4">
              {isLoading ? "Loading..." : "Fetch Users"}
            </Button>

            {users.length > 0 ? (
              <div className="mt-4 max-h-[300px] overflow-y-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left">ID</th>
                      <th className="text-left">Nickname</th>
                      <th className="text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="py-2 text-xs truncate max-w-[100px]">
                          {user.id}
                        </td>
                        <td className="py-2">{user.nickname}</td>
                        <td className="py-2 text-xs">
                          {new Date(user.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No users found or not fetched yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseSetupStoryboard;
