// components/GrayFilterSwitch.tsx
import React from "react";

interface GrayFilterSwitchProps {
	grayFilter: boolean;
	setGrayFilter: (value: boolean) => void;
}

export default function GrayFilterSwitch({
	grayFilter,
	setGrayFilter,
}: GrayFilterSwitchProps) {
	const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setGrayFilter(isChecked);
		localStorage.setItem("grayFilter", isChecked.toString());
	};

	return (
		<div className="flex items-center gap-4 mt-4 select-none">
			<label className="relative inline-flex items-center cursor-pointer group">
				<input
					type="checkbox"
					className="sr-only peer"
					checked={grayFilter}
					onChange={handleToggle}
				/>

				<div className="w-16 h-9 relative rounded-full overflow-hidden shadow-inner  transition-all">
					<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

					<div
						className={`absolute inset-0 bg-zinc-600 transition-opacity duration-500 ease-in-out ${
							grayFilter ? "opacity-100" : "opacity-0"
						}`}
					/>
				</div>

				<div
					className={`
            absolute top-[4px] left-[4px] bg-white border-gray-300 border rounded-full h-7 w-7 
            transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-md z-10 
            flex items-center justify-center
            peer-checked:translate-x-7 peer-checked:border-zinc-400
        `}
				>
					{/* Ícone Colorido */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`w-4 h-4 text-purple-600 transition-opacity duration-300 absolute ${
							grayFilter ? "opacity-0 scale-50" : "opacity-100 scale-100"
						}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
						/>
					</svg>

					{/* Ícone TV Antiga */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`w-4 h-4 text-zinc-600 transition-opacity duration-300 absolute ${
							grayFilter
								? "opacity-100 scale-100"
								: "opacity-0 scale-50 rotate-90"
						}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>
			</label>

			<div
				className="cursor-pointer"
				onClick={() => setGrayFilter(!grayFilter)}
			>
				<p
					className={`text-sm font-bold transition-colors duration-300 ${
						grayFilter
							? "text-zinc-400"
							: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400"
					}`}
				>
					{grayFilter ? "GRAY MODE" : "COLOR MODE"}
				</p>
			</div>
		</div>
	);
}
