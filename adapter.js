module.exports = {
  getUsers: data => {
    return {
      username: data.username || "",
      password: data.password || "",
      email: data.email || "",
      roles: data.roles || []
    };
  }
};
