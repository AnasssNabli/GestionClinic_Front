import { alexsys } from "./envirenment";

const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`, 
  "Content-Type": "application/json"
};

export const fetchSecretaires = () => {
  return alexsys.get('/Secretaire', { headers });
}

export const fetchSecretaireById = (id) => {
  return alexsys.get(`/Secretaire/${id}`, { headers });
}

export const createSecretaire = (secretaire) => {
  return alexsys.post('/Secretaire', secretaire, { headers });
}

export const updateSecretaire = (id, updatedSecretaire) => {
  return alexsys.put(`/Secretaire/${id}`, updatedSecretaire, { headers });
}

export const deleteSecretaire = (id) => {
  return alexsys.delete(`/Secretaire/${id}`, { headers });
}
