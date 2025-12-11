export const logout = () => {
  // Clear tokens, sessions, etc.
  localStorage.removeItem("authToken");
  sessionStorage.clear();
  console.log("User logged out");
};
