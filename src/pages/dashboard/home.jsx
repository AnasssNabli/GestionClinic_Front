import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Composant Carousel pour la Vue d'Ensemble de la Santé Cardiaque
const HeartHealthCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Vue d'Ensemble de la Santé Cardiaque",
      description: "Maintenir une bonne santé cardiaque est essentiel pour la longévité.",
      extraInfo: "SpO2 97%, Battements cardiaques réguliers",
      img: "/img/sante.jpg",
    },
    {
      id: 2,
      title: "Importance du Sommeil",
      description: "Le sommeil est crucial pour la récupération et la santé cardiaque globale.",
      extraInfo: "Il est recommandé de dormir 7 à 9 heures par nuit.",
      img: "/img/someil.jpg",
    },
    {
      id: 3,
      title: "Habitudes Alimentaires Saines",
      description: "Une alimentation équilibrée aide à améliorer la fonction cardiovasculaire.",
      extraInfo: "Réduisez la consommation de sel, de sucre et d'aliments transformés.",
      img: "/img/alimentation.jpg",
    },
    {
      id: 4,
      title: "Importance de l'Exercice",
      description: "Faire de l'exercice régulièrement renforce le cœur et améliore la circulation sanguine.",
      extraInfo: "Essayez de faire au moins 30 minutes d'activité physique par jour.",
      img: "/img/exercice.jpg",
    },
    {
      id: 5,
      title: "Gestion du Stress",
      description: "Le stress chronique peut nuire à la santé cardiaque. Apprenez à le gérer efficacement.",
      extraInfo: "Des techniques comme la méditation et le yoga peuvent être bénéfiques.",
      img: "/img/stress.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden mb-6">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 bg-white shadow-lg rounded-2xl p-6"
            style={{ minWidth: "100%" }}
          >
            <div className="relative w-full" style={{ height: "24rem" }}>
              <img
                src={slide.img}
                alt={slide.title}
                className="object-cover w-1000 h-full rounded-2xl" // Ensure full width and cover
              />
            </div>
            <div className="mt-4 text-blue-900">
              <h2 className="text-3xl font-bold">{slide.title}</h2>
              <p className="text-sm mt-2">{slide.description}</p>
              {slide.extraInfo && (
                <p className="text-xs text-gray-500">{slide.extraInfo}</p>
              )}
              <button className="mt-4 text-blue-500 font-semibold">Bienvennue chez nous</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              activeIndex === index ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Composant Carousel pour les Docteurs
const DoctorCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const doctors = [
    {
      id: 1,
      name: "Dr. Dexter Morgan",
      speciality: "Blood Spatter",
      img: "/img/dex2.jpg",
    },
    {
      id: 2,
      name: "Dr. Tazi Ali",
      speciality: "Neurologue",
      img: "/img/seasmoke.jpg",
    },
    {
      id: 3,
      name: "Dr. Debra Morgan",
      speciality: "Pédiatre",
      img: "/img/syrax.jpg",
    },
    {
      id: 4,
      name: "Dr. Maria Laguerta",
      speciality: "Dermatologue",
      img: "/img/dreamfire.jpg",
    },
  ];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % doctors.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? doctors.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        {doctors.map((doctor, index) => (
          <div
            key={doctor.id}
            className={`w-1/3 p-4 transform transition-transform duration-500 ${
              index === activeIndex ? "opacity-100 scale-105" : "opacity-50 scale-95"
            }`}
          >
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
              <img
                src={doctor.img}
                alt={doctor.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-blue-900">{doctor.name}</h3>
              <p className="text-gray-500">{doctor.speciality}</p>
              <button className="mt-4 text-blue-500 font-semibold">Voir Profil</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={handlePrev} className="text-blue-500 font-semibold">
          Précédent
        </button>
        <button onClick={handleNext} className="text-blue-500 font-semibold">
          Suivant
        </button>
      </div>
    </div>
  );
};

export function Home() {
  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">
      {/* Carousel Vue d'Ensemble de la Santé Cardiaque */}
      <HeartHealthCarousel />

      {/* Méditation et Récupération */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Objectif de Récupération avec Progression Circulaire */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Objectif de Récupération</h2>
          <div className="w-40 mx-auto">
            <CircularProgressbar
              value={80}
              text={`80%`}
              styles={buildStyles({
                pathColor: "#3B82F6",
                textColor: "#1E3A8A",
                trailColor: "#D1D5DB",
              })}
            />
          </div>
        </div>

        {/* Décoration du Calendrier */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Vue Mensuelle</h2>
          <div className="w-40 mx-auto">
          <CircularProgressbar
          value={90}
          text={`90%`}
          styles={buildStyles({
            pathColor: "#3B82F6",
            textColor: "#1E3A8A",
            trailColor: "#D1D5DB",
          })}
        />
          </div>
        </div>
      </div>

      {/* Choisir votre docteur personnel */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Choisissez votre docteur personnel</h2>
        <DoctorCarousel />
      </div>

      {/* Localisation de l'Hôpital */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Trouvez-nous</h2>
        <p className="text-gray-700 mb-4">
          Notre hôpital est situé au 123 Boulevard du Bien-Être, Ville de la Santé. Nous offrons des soins 24h/24 et une large gamme de services médicaux pour garantir que votre santé est entre de bonnes mains.
        </p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509319!2d144.953736315844!3d-37.81627974202167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce6e0!2sHospital!5e0!3m2!1sen!2sus!4v1624908398440!5m2!1sen!2sus"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Localisation de l'Hôpital"
        ></iframe>
      </div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-900 shadow-lg rounded-2xl p-6 mb-6 text-white">
      <h2 className="text-3xl font-bold mb-4">Suivi Personnel du Sommeil</h2>
      <p className="mb-4">Suivez vos habitudes de sommeil et améliorez votre santé au fil du temps.</p>
      <button className="bg-white text-blue-900 px-4 py-2 rounded-lg">
        Prenez un rendez-vous
      </button>
    </div>
    </div>
  );
}