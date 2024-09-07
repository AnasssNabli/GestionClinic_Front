import { alexsys } from "./envirenment";

const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
};

// Fetch all rendez-vous
export const fetchRendezVous = () => {
  return alexsys.get('/RendezVous', { headers });
}

export const fetchRendezVouss = async () => {
  try {
      const response = await alexsys.get('/RendezVous', { headers });
      const data = response.data;

      // Filtrer les rendez-vous avec le statut "Planifie"
      const filteredData = data.filter(appointment => appointment.statut === "Planifie");

      // Formater les donnÃ©es par date et heure
      const formattedData = filteredData.reduce((acc, appointment) => {
          const {id_RendezVous, date, heure, patientName } = appointment;
          const formattedDate = new Date(date).toLocaleDateString();
          const timeSlot = `${heure} - ${parseFloat(heure) + 1}.00`;

          if (!acc[formattedDate]) {
              acc[formattedDate] = {};
          }

          if (!acc[formattedDate][timeSlot]) {
              acc[formattedDate][timeSlot] = {
                  id: id_RendezVous,  // Inclure l'ID du rendez-vous
                  name: patientName,
              };
          }

          return acc;
      }, {});

      return formattedData;
  } catch (error) {
      console.error("Error fetching rendez-vous:", error);
      return {};
  }
};


// Create a new rendez-vous
export const createRendezVous = (rendezVous) => {
  return alexsys.post('/RendezVous', rendezVous, { headers });
}

// Update the status of a rendez-vous
export const updateRendezVousStatut = (id, statut) => {
  return alexsys.put(`/RendezVous/UpdateStatut/${id}`, statut, { headers });
}

// Delete a rendez-vous
export const deleteRendezVous = (id) => {
  return alexsys.delete(`/RendezVous/${id}`, { headers });
}