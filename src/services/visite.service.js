import { alexsys } from "./envirenment";

const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
};


export const fetchvisite = () => {

  return alexsys.get('/Visite', { headers });
}
// Create a new rendez-vous
export const createvisite = (visite) => {
    console.log(visite);
    
  return alexsys.post('/Visite', visite, { headers });
}

// Update the status of a rendez-vous
export const updateRendezVousStatut = (id, statut) => {
  return alexsys.put(`/RendezVous/UpdateStatut/${id}`, statut, { headers });
}
