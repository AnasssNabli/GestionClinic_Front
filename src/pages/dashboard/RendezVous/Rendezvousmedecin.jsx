import React, { useEffect, useState } from 'react';
import { fetchRendezVouss, updateRendezVousStatut } from '@/services/rendezvous.service';
import { IconButton } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import RendezVousDetails from './RendezVousdetails';

function generateWeeks(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let week = [];

    for (let day = 1; day <= daysInMonth; day++) {
        week.push(day);
        if (week.length === 7 || day === daysInMonth) {
            weeks.push(week);
            week = [];
        }
    }

    return weeks;
}

function RendezVous() {
    const [appointments, setAppointments] = useState({});
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [reload, setReload] = useState(true); // Add reload state
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const weeks = generateWeeks(year, month);

    useEffect(() => {
        fetchData();
    }, [reload]); // Depend on reload state

    const fetchData = async () => {
        try {
            const data = await fetchRendezVouss();
            setAppointments(data);
            setReload(false); // Reset reload state after fetching data
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleCancelAppointment = (dateKey, timeSlot) => {
        Swal.fire({
            title: 'Êtes-vous sûr(e) ?',
            text: "Voulez-vous vraiment annuler ce rendez-vous ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, annulez-le !',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const appointmentId = appointments[dateKey][timeSlot].id;
                    await updateRendezVousStatut(appointmentId, 'Annulé');
                    Swal.fire('Annulé !', 'Le rendez-vous a été annulé avec succès.', 'success');
                    setReload(true); // Trigger reload
                } catch (error) {
                    Swal.fire('Erreur !', "Une erreur s'est produite lors de l'annulation du rendez-vous.", 'error');
                }
            }
        });
    };

    const handleSelectAppointment = (dateKey, timeSlot) => {
        setSelectedAppointment(appointments[dateKey][timeSlot]);
        setIsDetailsDialogOpen(true); // Open the details dialog
    };

    const handleCloseDetails = () => {
        setIsDetailsDialogOpen(false);
        setSelectedAppointment(null);
    };

    const formatAppointmentText = (appointment, timeSlot) => {
        if (!appointment || !appointment.patientName) {
            return `Unknown ${timeSlot}`; 
        }
        const lastName = appointment.patientName.split(' ')[0];
        return `${lastName} ${timeSlot}`;
    };

    return (
        <div className="container mx-auto mt-10">
            <div className="wrapper bg-white rounded shadow w-full">
                <div className="header flex justify-between border-b p-2">
                    <span className="text-lg font-bold text-blue-900">{`${today.toLocaleString('default', { month: 'long' })} ${year}`}</span>
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <th
                                    key={day}
                                    className="p-2 border-r h-12 xl:w-44 lg:w-36 md:w-32 sm:w-28 w-24 xl:text-base text-sm text-blue-900"
                                >
                                    <span className="block text-blue-900">{day}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((week, weekIndex) => (
                            <tr key={weekIndex} className="text-center">
                                {week.map((day) => {
                                    const dateKey = new Date(year, month, day).toLocaleDateString();
                                    return (
                                        <td
                                            key={day}
                                            className="border p-1 h-96 xl:w-44 lg:w-36 md:w-32 sm:w-28 w-24 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300"
                                        >
                                            <div className="flex flex-col h-full overflow-hidden">
                                                <div className="top h-10 w-full">
                                                    <span className="text-gray-500">{day}</span>
                                                </div>
                                                <div className="bottom flex-grow py-1 w-full cursor-pointer">
                                                    {appointments[dateKey] ? (
                                                        Object.keys(appointments[dateKey]).map((timeSlot, index) => (
                                                            <div
                                                                key={index}
                                                                className="event bg-purple-400 text-white rounded p-1 text-sm mb-1 flex items-center justify-between"
                                                                onClick={() => handleSelectAppointment(dateKey, timeSlot)}
                                                                style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}
                                                            >
                                                                <span className="event-name ml-2 mx-auto">
                                                                    {formatAppointmentText(appointments[dateKey][timeSlot], timeSlot)}
                                                                </span>
                                                                <IconButton
                                                                    size="sm"
                                                                    variant="text"
                                                                    onClick={(e) => { e.stopPropagation(); handleCancelAppointment(dateKey, timeSlot); }}
                                                                    className="ml-auto bg-dark"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        className="h-5 w-5"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M6 18L18 6M6 6l12 12"
                                                                        />
                                                                    </svg>
                                                                </IconButton>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="event bg-gray-100 text-blue-900 rounded p-1 text-sm mb-1">
                                                            aucun rendez-vous
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    );
                                })}
                                {week.length < 7 &&
                                    Array.from({ length: 7 - week.length }).map((_, i) => (
                                        <td
                                            key={`empty-${i}`}
                                            className="border p-1 h-96 xl:w-44 lg:w-36 md:w-32 sm:w-28 w-24 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300"
                                        ></td>
                                    ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isDetailsDialogOpen && (
                <RendezVousDetails
                    appointment={selectedAppointment}
                    handleClose={handleCloseDetails} // Pass the close function
                    setReload={setReload} // Pass the setReload function
                />
            )}
        </div>
    );
}

export default RendezVous;
