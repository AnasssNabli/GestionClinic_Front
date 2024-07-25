import { alexsys } from "./envirenment";
const login = async (Email, Password) => {
  try {
    const response = await alexsys.post(`/Auth/Login`, { Email, Password });
    console.log(response.data.token);
    return response.data.token;
  } catch (error) {
    console.log("error login", error);
    throw new Error('Invalid email or password');
  }
}; 
const register = async (user) => {
  try {
    console.log(user);
    const response = await alexsys.post(`/Auth/Register`, user );
    console.log("register");
      const resp = await login(user.Email, user.Password);
      return resp;
  } catch (error) {
    console.log("error register", error);
    throw new Error('Registration failed');
  }
};
const logout = async (token) => {
  try {
    console.log("logout");
    const response = await alexsys.post(`/logout/`, { token });
    return response.data.message;
  } catch (error) {
    console.log("error logout", error);
    throw new Error('Logout failed');
  }
};


export { login, register,logout};
