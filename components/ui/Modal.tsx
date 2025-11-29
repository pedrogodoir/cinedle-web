import { X } from "lucide-react";
import { FaXmark } from "react-icons/fa6";
export const Modal = ({
	isOpen,
	onClose,
	colorBlind,
	setColorBlind,
	grayFilter,
	setGrayFilter,
	children,
}: {  
	isOpen: boolean;
	onClose: () => void;
	colorBlind: boolean;
	grayFilter: boolean;
	setColorBlind: (value: boolean) => void;
	setGrayFilter: (value: boolean) => void;
	children?: React.ReactNode;
	}) => {
	if (!isOpen) return null;
	
	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
			<div className="relative bg-zinc-950 border-3 border-zinc-700 p-6 rounded-md shadow-lg max-w-sm md:max-w-md w-full">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-200"
				>
					<X />
				</button>

				<h1 className="text-white">Configurações</h1>
				<div className="flex flex-col gap-4 mt-4">
					<div className="flex items-center gap-3">
						<div className="relative inline-block w-11 h-5">
							<input
								onChange={(e) => {
									setColorBlind(e.target.checked);
									localStorage.setItem(
										"colorBlind",
										e.target.checked.toString()
									);
								}}
								id="switch-color-blind"
								type="checkbox"
								checked={colorBlind}
								className="peer appearance-none w-11 h-5 bg-zinc-200 rounded-full checked:bg-red-500 cursor-pointer transition-colors duration-300"
							/>
							<label
								htmlFor="switch-color-blind"
								className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-300 cursor-pointer"
							></label>
						</div>
						<label htmlFor="switch-color-blind"
							className="text-zinc-200 text-sm cursor-pointer"
						>
							<p className="font-medium">Color blind mode</p>
						</label>
					</div>


					{/* <div className="flex items-center gap-3">
						<div className="relative inline-block w-11 h-5">
							<input
								onChange={(e) => {
									setGrayFilter(e.target.checked);
									localStorage.setItem(
										"grayFilter",
										e.target.checked.toString()
									);
								}}
								id="switch-gray-filter"
								type="checkbox"
								checked={grayFilter}
								className="peer appearance-none w-11 h-5 bg-zinc-200 rounded-full checked:bg-red-500 cursor-pointer transition-colors duration-300"
							/>
							<label
								htmlFor="switch-gray-filter"
								className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-gray-300 cursor-pointer">
							</label>		
						</div>
						<label htmlFor="switch-gray-filter" className="text-zinc-200 text-sm cursor-pointer">
							<p className="font-medium">Gray Filter</p>
						</label>
					</div> */}
				</div>
				<div className="mt-6">{children}</div>
			</div>
		</div>
	);
};
