import { supabase } from "./supabase";

// In a real app, you would use a proper email service like SendGrid, Mailgun, etc.
// For this demo, we'll simulate email sending with console logs and local storage

// Generate a random token
const generateToken = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Store confirmation tokens in localStorage for demo purposes
const storeConfirmationToken = (userId: string, token: string) => {
  const tokens = JSON.parse(localStorage.getItem("confirmationTokens") || "{}");
  tokens[token] = userId;
  localStorage.setItem("confirmationTokens", JSON.stringify(tokens));
};

// Send confirmation email
export const sendConfirmationEmail = async (userId: string, email: string) => {
  console.log(`Sending confirmation email to ${email} for user ${userId}`);
  try {
    // Generate confirmation token
    const token = generateToken();

    // Store token in localStorage (for demo)
    storeConfirmationToken(userId, token);

    // In a real app, you would send an actual email here
    console.log(`CONFIRMATION EMAIL SENT TO: ${email}`);
    console.log(
      `Confirmation Link: ${window.location.origin}/confirm-email?token=${token}`,
    );
    console.log("For demo purposes, use this link to confirm your email:");
    console.log(`http://localhost:5173/confirm-email?token=${token}`);

    // For demo purposes, automatically confirm immediately
    try {
      await confirmEmail(token);
      console.log(`Email automatically confirmed for demo purposes: ${email}`);
    } catch (confirmError) {
      console.error("Auto-confirmation failed:", confirmError);
    }

    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

// Confirm email
export const confirmEmail = async (token: string) => {
  try {
    // Get userId from token (from localStorage in demo)
    const tokens = JSON.parse(
      localStorage.getItem("confirmationTokens") || "{}",
    );
    const userId = tokens[token];

    if (!userId) {
      throw new Error("Invalid confirmation token");
    }

    // Update user in database
    const { error } = await supabase
      .from("users")
      .update({ email_confirmed: true })
      .eq("id", userId);

    if (error) throw error;

    // Remove used token
    delete tokens[token];
    localStorage.setItem("confirmationTokens", JSON.stringify(tokens));

    return true;
  } catch (error) {
    console.error("Error confirming email:", error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string) => {
  try {
    // Find user by email
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (error) throw error;

    // If no user found, silently return (for security reasons)
    if (!users || users.length === 0) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return true;
    }

    const user = users[0];

    // Generate reset token
    const resetToken = generateToken();

    // Set token expiry (24 hours from now)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    // Save token to database
    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expires: expiryDate.toISOString(),
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // In a real app, you would send an actual email here
    console.log(`PASSWORD RESET EMAIL SENT TO: ${email}`);
    console.log(
      `Reset Link: ${window.location.origin}/reset-password?token=${resetToken}`,
    );
    console.log("For demo purposes, use this link to reset your password:");
    console.log(`http://localhost:5173/reset-password?token=${resetToken}`);

    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
