import { alexsys } from "./envirenment";


const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
};

export const fetchUserData = () => {
  return alexsys.get(`/Auth/GetUser` , {headers})
}

export const UpdateUserData = (id , Data) => {
  return alexsys.put(`/Auth/UpdateUser/${id}` , Data , {headers})
}
