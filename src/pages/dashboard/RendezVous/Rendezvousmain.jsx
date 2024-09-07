import React, { useState, useEffect } from "react";
import RendezVous from "./Rendezvousmedecin";
import Rendezvous from "./Rendezvous";

export function RendezVousMain() {
  const [type, setType] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = localStorage.getItem("type");
    console.log(res);
    setType(res);
  }

  return (
    <div>
      {type === "medecin" ? <RendezVous /> : <Rendezvous />}
    </div>
  );
}

export default RendezVousMain;
