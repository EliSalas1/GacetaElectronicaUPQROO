import { FaGoogle } from "react-icons/fa";

export default function GoogleButton() {
  return (
    <div className="flex justify-center my-2">
      <a href="#" className="border-2 border-gray-200 rounded-full p-3 mx-1">
        <FaGoogle className="text-sm" />
      </a>
    </div>
  );
}