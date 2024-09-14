import { alexsys } from "./envirenment";
const login = async (Email, Password) => {
  try {
    const response = await alexsys.post(`/Auth/Login`, { Email, Password });
    console.log(response.data.type);
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.log("error login", error);
    throw new Error('Invalid email or password');
  }
}; 
const register = async (user) => {
  try {
    console.log(user);
    const response = await alexsys.post(`/Auth/Register`, {
      "type": "admin",
      "Email": "admin@gmail.com",
      "Password": "Anas246@",
      "Nom": "John",
      "Prenom": "QT",
      "Cin":"BJ5866",
      "Telephone": "0660605050",
      "DateNaissance": "1992-03-25"
    } );
    console.log("register");
      const resp = await login(user.Email, user.Password);
      return resp;
  } catch (error) {
    console.log("error register", error);
    throw new Error('Registration failed');
  }
};

const register2 = async (user) => {
  try {
    console.log(user);

    // Register the user
    const response = await alexsys.post(`/Auth/Register`, user);
    console.log("register    :    ",response.data);

    // If the user type is 'medecin', proceed with additional calls
    if (user.type === 'medecin') {
      
      console.log('entered :');

      // Create Disponibilities
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const disponibilities = daysOfWeek.flatMap(day => [
        { id_user: response.data, jourDeLaSemaine: day, heureDebut: '08.00', heureFin: '12.00' },
        { id_user: response.data, jourDeLaSemaine: day, heureDebut: '14.00', heureFin: '18.00' },
      ]);

      await alexsys.post('/Disponibilite/Disponibiliteaddd', disponibilities);
      console.log('Disponibilities created');
    }

    return response;
  } catch (error) {
    console.log("error register", error);
    throw new Error('Registration failed');
  }
};


const logout = async (token) => {
  try {
    console.log("logout");
    const response = await alexsys.post(`/Auth/Logout`, { token });
    console.log("logout good");
    return response.data.message;
  } catch (error) {
    console.log("error logout", error);
    throw new Error('Logout failed');
  }
};


export { login, register,logout , register2};
