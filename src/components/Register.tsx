function Register() {
  return (
    <form className="w-3/4 max-w-sm space-y-5">
      <h2 className="text-2xl font-bold text-white text-center">Crear Cuenta</h2>

      <input
        type="text"
        placeholder="Nombre"
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <input
        type="text"
        placeholder="Apellido"
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 transition"
      >
        Registrarse
      </button>
    </form>
  );
}

export default Register;
