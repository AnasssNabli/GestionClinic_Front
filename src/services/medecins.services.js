import { alexsys } from "./envirenment";

const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`, 
  "Content-Type": "application/json"
};

export const fetchMedecins = () => {
  return alexsys.get('/Medecin', { headers });
}

export const fetchMedecinById = (id) => {
  return alexsys.get(`/Medecin/${id}`, { headers });
}

export const createMedecin = (medecin) => {
  return alexsys.post('/Medecin', medecin, { headers });
}

export const updateMedecin = (id, updatedMedecin) => {
  return alexsys.put(`/Medecin/${id}`, updatedMedecin, { headers });
}

export const deleteMedecin = (id) => {
  return alexsys.delete(`/Medecin/${id}`, { headers });
}
