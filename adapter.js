module.exports = {
  getUsers: data => {
    return {
      username: data.username || '',
      password: data.password || '',
      email: data.email || '',
      roles: data.roles || [],
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      contactNumber: data.contactNumber || '',
      designation: data.designation || ''
    };
  }
};