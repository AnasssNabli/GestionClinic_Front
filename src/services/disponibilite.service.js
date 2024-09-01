import { alexsys } from "./envirenment";

// Get token from localStorage and set headers
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
};

// Fetch Disponibilite
export const fetchDisponibilite = () => {
  return alexsys.get('/Disponibilite', { headers });
};

// Update Disponibilite
export const updateDisponibilite = async (disponibilities, day) => {
  try {
    // Delete existing disponibilites for the specified day
    await alexsys.delete('/Disponibilite', {
      headers,
      params: { jourDeLaSemaine: day }
    });

    console.log('Deleted disponibilites for day:', day);

    // Post the new disponibilites
    await alexsys.post('/Disponibilite', disponibilities, { headers });

    console.log('Posted new disponibilites:', disponibilities);
  } catch (error) {
    console.error('Error updating disponibilites:', error);
  }
};
