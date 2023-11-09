export const useGetUserID = () => {
  const userID = window.localStorage.getItem("userID");
  // Parse the retrieved value to an integer
  return userID ? parseInt(userID, 10) : null;
};
