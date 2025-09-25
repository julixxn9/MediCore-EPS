function Login() {
  return (
    <form className="w-3/4 max-w-sm space-y-5">
      <h2 className="text-2xl font-bold text-white text-center">Iniciar Sesión</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition"
      >
        Entrar
      </button>
    </form>
  );
}

export default Login;
