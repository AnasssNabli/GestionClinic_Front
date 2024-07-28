
import { alexsys } from "./envirenment";

const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`, 
  "Content-Type": "application/json"
};
export const fetchDepartements = () => {
  return alexsys.get('/Departement', { headers });
}

export const fetchDepartementById = (id) => {
  return alexsys.get(`/Departement/${id}`, { headers });
}

export const createDepartement = (departement) => {
  return alexsys.post('/Departement', departement, { headers });
}

export const updateDepartement = (id, updatedDepartement) => {
  return alexsys.put(`/Departement/${id}`, updatedDepartement, { headers });
}

export const deleteDepartement = (id) => {
  return alexsys.delete(`/Departement/${id}`, { headers });
}
