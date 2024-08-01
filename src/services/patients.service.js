import { alexsys } from "./envirenment";

const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`, 
  "Content-Type": "application/json"
};

export const fetchPatients = () => {
  return alexsys.get('/Patient', { headers });
}

export const fetchPatientById = (id) => {
  return alexsys.get(`/Patient/${id}`, { headers });
}

export const createPatient = (patient) => {
  return alexsys.post('/Patient', patient, { headers });
}

export const updatePatient = (id, updatedPatient) => {
  return alexsys.put(`/Patient/${id}`, updatedPatient, { headers });
}

export const deletePatient = (id) => {
  return alexsys.delete(`/Patient/${id}`, { headers });
}
