let verificationStore = {};
// In-memory store for verification data (for demonstration)
export const saveVerificationData = async ({ email, verificationCode, expirationTime }) => {
  verificationStore[email] = { verificationCode, expirationTime };
  console.log(`Verification data saved for ${email}`);
};

// Function to fetch verification data
export const getVerificationData = async (email) => {
  console.log(`Fetching verification data for ${email}`);
  return verificationStore[email];
};

// Function to delete verification data
export const deleteVerificationData = async (email) => {
  console.log(`Deleting verification data for ${email}`);
  delete verificationStore[email];
};