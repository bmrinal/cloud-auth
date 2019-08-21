module.exports = {
  getUsers: data => {
    return {
      username: data.username || '',
      password: data.password || '',
      email: data.email || '',
      roles: data.roles || [],
      firstname: data.firstname || '',
      lastname: data.lastname || '',
      contactNumber: data.contactNumber || '',
      designation: data.designation || ''
    };
  }
};