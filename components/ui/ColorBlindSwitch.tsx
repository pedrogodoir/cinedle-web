import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface ColorBlindSwitchProps {
	colorBlind: boolean;
	setColorBlind: (value: boolean) => void;
}

export default function ColorBlindSwitch({
	colorBlind,
	setColorBlind,
}: ColorBlindSwitchProps) {
	const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setColorBlind(isChecked);
		localStorage.setItem("colorBlind", isChecked.toString());
	};

	return (
		<div className="flex items-center gap-4 mt-4 select-none">
			<label className="relative inline-flex items-center cursor-pointer group">
				<input
					type="checkbox"
					className="sr-only peer"
					checked={colorBlind}
					onChange={handleToggle}
				/>

				{/* Background do switch */}
				<div className="w-16 h-9 relative rounded-full overflow-hidden shadow-lg transition-all">
					{/* Gradiente normal (verde/amarelo/vermelho) */}
					<div
						className={`absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-opacity duration-500 ${colorBlind ? "opacity-0" : "opacity-100"
							}`}
					/>

					{/* Gradiente colorblind (azul/amarelo/laranja) */}
					<div
						className={`absolute inset-0 bg-gradient-to-r from-sky-700 via-yellow-300 to-orange-600 transition-opacity duration-500 ${colorBlind ? "opacity-100" : "opacity-0"
							}`}
					/>
				</div>

				{/* Bolinha do switch */}
				<div
					className={`
            absolute top-[4px] left-[4px] bg-white border-2 rounded-full h-7 w-7 
            transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] 
            shadow-md z-10 flex items-center justify-center
            peer-checked:translate-x-7 
            ${colorBlind ? "border-sky-700" : "border-green-500"}
          `}
				>
					{/* Ícone Normal */}
					<Eye
						className={`w-4 h-4 text-green-600 transition-all duration-300 absolute ${colorBlind ? "opacity-0 scale-50 rotate-180" : "opacity-100 scale-100"
							}`}
					/>

					{/* Ícone ColorBlind */}
					<EyeOff
						className={`w-4 h-4 text-sky-700 transition-all duration-300 absolute ${colorBlind ? "opacity-100 scale-100" : "opacity-0 scale-50 -rotate-180"
							}`}
					/>
				</div>
			</label>

			{/* Texto */}
			<div
				className="cursor-pointer"
				onClick={() => setColorBlind(!colorBlind)}
			>
				<p
					className={`text-sm font-bold transition-colors duration-300 ${colorBlind
							? "text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-orange-500"
							: "text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-red-500"
						}`}
				>
					{colorBlind ? "COLORBLIND MODE" : "NORMAL MODE"}
				</p>
			</div>
		</div>
	);
}
