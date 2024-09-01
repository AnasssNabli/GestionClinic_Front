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

export const createMedecin = async (medecin) => {
  const res = await alexsys.post('/Medecin', medecin, { headers });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  console.log(res);
  
  const disponibilities = daysOfWeek.flatMap(day => [
    { id_user : res ,jourDeLaSemaine: day, heureDebut: '08:00', heureFin: '12:00' },
    {  id_user : res ,jourDeLaSemaine: day, heureDebut: '14:00', heureFin: '18:00' }
  ]);

  await alexsys.post('/Disponibilite/Disponibiliteaddd', disponibilities, { headers });
  
  return res;
}


export const updateMedecin = (id, updatedMedecin) => {
  return alexsys.put(`/Medecin/${id}`, updatedMedecin, { headers });
}

export const deleteMedecin = (id) => {
  return alexsys.delete(`/Medecin/${id}`, { headers });
}
