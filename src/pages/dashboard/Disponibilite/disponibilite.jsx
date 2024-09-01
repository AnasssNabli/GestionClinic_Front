import React, { useEffect, useState } from 'react';
import { fetchDisponibilite } from '@/services/disponibilite.service';
import Updatedisponibilite from './Updatedisponibilite'; // Import the update dialog component

export function Disponibilite() {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 24 }, (_, i) => (i).toString().padStart(2, '0') + ':00');
    const [availability, setAvailability] = useState({});
    const [nom, setNom] = useState();
    const [prenom, setPrenom] = useState();
    const [dayToUpdate, setDayToUpdate] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const dayColors = {
        'Monday': '#fff59d',
        'Tuesday': '#e6ee9c',
        'Wednesday': '#c5e1a5',
        'Thursday': '#a5d6a7',
        'Friday': '#80cbc4',
        'Saturday': '#80deea',
        'Sunday': '#81d4fa'
    };

    useEffect(() => {
        getAvailability();
    }, []);

    const getAvailability = async () => {
        try {
            const response = await fetchDisponibilite();
            const data = response.data;
            setNom(data[0].medecin.nom.toUpperCase());
            setPrenom(data[0].medecin.prenom.toUpperCase());
    
            const availabilityMap = {};
    
            data.forEach(item => {
                const { jourDeLaSemaine, heureDebut, heureFin } = item;
    
                // Normalize heures if minutes are missing
                const normalizeTime = (time) => {
                    if (time.length === 1 || time.length === 2) {
                        return `${time}.00`; // Append ".00" if only hours are provided
                    }
                    return time;
                };
    
                const startTime = normalizeTime(heureDebut);
                const endTime = normalizeTime(heureFin);
    
                const startHour = parseInt(startTime.split('.')[0], 10);
                const startMinutes = parseInt(startTime.split('.')[1], 10);
                const endHour = parseInt(endTime.split('.')[0], 10);
                const endMinutes = parseInt(endTime.split('.')[1], 10);
    
                if (!availabilityMap[jourDeLaSemaine]) {
                    availabilityMap[jourDeLaSemaine] = {};
                }
    
                for (let hour = startHour; hour <= endHour; hour++) {
                    if (hour === startHour && startMinutes > 0) {
                        availabilityMap[jourDeLaSemaine][hour] = {
                            percentage: (startMinutes / 60) * 100,
                            side: 'right'
                        };
                    } else if (hour === endHour && endMinutes < 60) {
                        availabilityMap[jourDeLaSemaine][hour] = {
                            percentage: (endMinutes / 60) * 100,
                            side: 'left'
                        };
                    } else {
                        availabilityMap[jourDeLaSemaine][hour] = {
                            percentage: 100,
                            side: 'both'
                        };
                    }
                }
            });
    
            setAvailability(availabilityMap);
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };
    

    const handleUpdateClick = (day) => {
        setDayToUpdate(day);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setDayToUpdate(null);
    };

    return (
        <div className="container mx-auto mt-10">
            <div className="wrapper bg-white rounded shadow w-full">
                <div className="header flex justify-between border-b p-2">
                    <span className="text-lg font-bold text-blue-900">Dr. {nom} {prenom}</span>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {daysOfWeek.map(day => (
                                <th key={day} className="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="xl:block lg:block md:block sm:block hidden text-blue-900">{day}</span>
                                        <span className="xl:hidden lg:hidden md:hidden sm:hidden block">{day.slice(0, 3)}</span>
                                        <button
                                        onClick={() => handleUpdateClick(day)}
                                        className="text-blue-900"
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                        </button>

                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map(hour => (
                            <tr key={hour} className="text-center">
                                {daysOfWeek.map(day => {
                                    const availabilityData = availability[day] || {};
                                    const { percentage = 0, side = 'both' } = availabilityData[parseInt(hour.split('.')[0], 10)] || {};
                                    const isAvailable = percentage > 0;
                                    const color = dayColors[day] || '#ffffff';

                                    return (
                                        <td
                                            key={day}
                                            className={`border text-blue-900 border-gray-300 p-1 h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10`}
                                            style={{
                                                background: isAvailable ?
                                                    side === 'both' ?
                                                        `linear-gradient(to right, ${color} ${percentage}%, #ffffff ${percentage}%)` :
                                                        side === 'right' ?
                                                            `linear-gradient(to right, #ffffff ${percentage}%, ${color} ${percentage}%)` :
                                                            `linear-gradient(to right, ${color} ${percentage}%, #ffffff ${percentage}%)` :
                                                    'white',
                                                backgroundSize: '100% 100%',
                                                backgroundRepeat: 'no-repeat',
                                                borderWidth: '1px',
                                                borderColor: '#e5e7eb',
                                                borderStyle: 'solid',
                                                boxShadow: 'inset 0 0 0 1px #ffffff'
                                            }}
                                        >
                                            {hour}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isDialogOpen && (
                <Updatedisponibilite
                    open={isDialogOpen}
                    day={dayToUpdate}
                    handleClose={handleCloseDialog}
                    setReload={getAvailability}
                />
            )}
        </div>
    );
}
