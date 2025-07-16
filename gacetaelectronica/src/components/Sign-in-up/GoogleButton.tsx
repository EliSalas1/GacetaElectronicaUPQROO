import { FaGoogle } from "react-icons/fa";

export default function GoogleButton() {
  return (
    <div className="flex justify-center my-4">
      <a href="#" className="flex items-center border-2 border-gray-200 rounded-full px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
        <FaGoogle className="mr-2" />
          Continuar con Google
      </a>
    </div>
  );
}