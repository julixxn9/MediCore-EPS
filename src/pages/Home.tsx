import { ProfileProvider, useProfile } from "../context/PerfileContext";
import PanelUsuario from "../components/PanelUsuario";
import ModUsuario from "../components/ModUsuario";

export default function HomePageWrapper() {
  return (
    <ProfileProvider>
      <Home />
    </ProfileProvider>
  );
}

function Home() {
  const { loading, openEdit, setOpenEdit } = useProfile();


  return (
    <main className="w-full min-h-screen p-6 md:p-10 bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-gray-100 relative">

      <PanelUsuario/>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <UserCard />
        </div>

        <div className="col-span-2 space-y-6">
          <InfoPanel />
          <VacunasList />
        </div>
      </div>

      {/* BOTÓN FLOTANTE */}
      <button
        aria-label="Editar perfil"
        onClick={() => setOpenEdit(true)}
        className="fixed right-6 bottom-6 bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-full shadow-2xl transform hover:-translate-y-1 transition z-[9999]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
          viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 20h9" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      </button>

      {/* MODAL SOLO CUANDO openEdit === true */}
      {openEdit && (
        <ModUsuario onClose={() => setOpenEdit(false)} />
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-purple-600 animate-pulse opacity-80" />
        </div>
      )}
    </main>
  );
}

/* -------------------
   SUBCOMPONENTES
   ------------------- */

function UserCard() {
  const { profile } = useProfile();
  if (!profile) {
    return (
      <div className="bg-[#0f1220] p-5 rounded-lg border border-gray-800 shadow-sm">
        <p className="text-sm text-gray-400">No hay datos del usuario</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1220] p-6 rounded-xl border border-gray-800 shadow-lg">
      <div className="flex items-center gap-4">
        <img src={profile.foto ?? "/default-avatar.png"} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-purple-600" />
        <div>
          <h2 className="text-xl font-semibold text-white">{profile.nombre} {profile.apellido}</h2>
          <p className="text-sm text-gray-300">{profile.rol}</p>
          <p className="text-xs text-gray-400">Cédula: {profile.cedula}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="p-3 bg-[#11121a] rounded-md">
          <p className="text-xs text-gray-400">Vacunas aplicadas</p>
          <p className="text-lg font-semibold text-white">3</p>
        </div>
        <div className="p-3 bg-[#11121a] rounded-md">
          <p className="text-xs text-gray-400">Vacunas pendientes</p>
          <p className="text-lg font-semibold text-white">1</p>
        </div>
      </div>
    </div>
  );
}

function InfoPanel() {
  const { profile } = useProfile();
  return (
    <div className="bg-[#0f1220] p-6 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-2">Resumen</h3>
      <p className="text-sm text-gray-300">
        Bienvenido{profile ? `, ${profile.nombre}` : ""}. Aquí puedes ver tu estado de vacunación,
        editar tu perfil y revisar recomendaciones.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat title="Siguiente vacuna" value="DTP - 2025-08-10" />
        <Stat title="Última visita" value="2024-12-01" />
        <Stat title="Recordatorios" value="2" />
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-3 bg-[#11121a] rounded-md">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function VacunasList() {
  // Por ahora mock — más adelante puedes traer endpoint real
  const vacunasAplicadas = [
    { id: 1, name: "Hepatitis B", date: "2023-02-14" },
    { id: 2, name: "Influenza", date: "2024-04-10" },
    { id: 3, name: "Tétanos", date: "2022-09-03" },
  ];

  const vacunasPendientes = [{ id: 99, name: "SRP (Sarampión, paperas, rubéola)", date: "2025-08-10" }];

  return (
    <div className="bg-[#0f1220] p-6 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Vacunas</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm text-gray-300 mb-2">Aplicadas</h4>
          <ul className="space-y-2">
            {vacunasAplicadas.map((v) => (
              <li key={v.id} className="p-3 bg-[#11121a] rounded-md flex justify-between items-center">
                <div>
                  <p className="text-sm text-white font-medium">{v.name}</p>
                  <p className="text-xs text-gray-400">{v.date}</p>
                </div>
                <span className="text-xs text-green-400 font-semibold">Completada</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm text-gray-300 mb-2">Pendientes</h4>
          <ul className="space-y-2">
            {vacunasPendientes.map((v) => (
              <li key={v.id} className="p-3 bg-[#11121a] rounded-md flex justify-between items-center">
                <div>
                  <p className="text-sm text-white font-medium">{v.name}</p>
                  <p className="text-xs text-gray-400">{v.date}</p>
                </div>
                <button className="text-xs bg-purple-600/90 px-3 py-1 rounded text-white">Agendar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* -------------------
   Modal y formulario (EditUserModal)
   ------------------- */