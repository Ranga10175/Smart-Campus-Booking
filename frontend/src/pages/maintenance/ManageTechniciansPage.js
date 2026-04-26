import React from "react";
const technicians=["tech1","tech2","tech3","tech4","tech5"];
export default function ManageTechniciansPage(){return <div className="max-w-4xl mx-auto p-8 text-left"><h1 className="text-3xl font-black text-[#0d1f4e] mb-6">Manage Technicians</h1><div className="bg-white rounded-3xl shadow border p-6"><p className="text-slate-500 mb-4">Use these technician IDs when assigning tickets.</p>{technicians.map(t=><div key={t} className="py-3 border-b last:border-b-0 font-bold text-slate-700">{t}</div>)}</div></div>}
