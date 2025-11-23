// Helper function to get user ID in consistent format
export const getUserID = (user) => {
  if (!user) return null;
  
  // Handle different formats
  if (user.id) {
    if (typeof user.id === 'string') return user.id;
    if (typeof user.id === 'object') {
      if (user.id.$oid) return user.id.$oid;
      if (user.id.toString) return user.id.toString();
    }
  }
  
  if (user._id) {
    if (typeof user._id === 'string') return user._id;
    if (typeof user._id === 'object') {
      if (user._id.$oid) return user._id.$oid;
      if (user._id.toString) return user._id.toString();
    }
  }
  
  return null;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
    return null;
  }
};

// Get current user ID
export const getCurrentUserID = () => {
  const user = getCurrentUser();
  return getUserID(user);
};


