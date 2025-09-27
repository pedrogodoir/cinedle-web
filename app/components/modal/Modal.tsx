export const Modal = ({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) => {
	if (!isOpen) return null;
	return (
		<>
			<div className="fixed inset-0 bg-black/50 flex justify-center items-center transition-opacity duration-300">
				<div className="relative bg-white p-6 rounded-md shadow-lg max-w-sm md:max-w-md w-full transition-transform duration-300 transform-gpu">
					
					
					<button 
						onClick={onClose} 
						className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
					>
						X
					</button>

					<h1 className="text-black">Cnnfigurações</h1>
					<div className="flex flex-col gap-4 mt-4">
						<div className="flex items-center gap-3">
							<div className="relative inline-block w-11 h-5">
								<input 
									id="switch-component-desc" 
									type="checkbox" 
									className="peer appearance-none w-11 h-5 bg-red-200 rounded-full checked:bg-red-500 cursor-pointer transition-colors duration-300" 
								/>
								<label 
									htmlFor="switch-component-desc" 
									className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer">
								</label>
							</div>
							<label htmlFor="switch-component-desc" className="text-slate-600 text-sm cursor-pointer">
								<p className="font-medium">Color blind mode</p>
							</label>
						</div>

						
						<div className="flex items-center gap-3">
							<div className="relative inline-block w-11 h-5">
								<input 
									id="switch-darkmode" 
									type="checkbox" 
									className="peer appearance-none w-11 h-5 bg-red-200 rounded-full checked:bg-red-500 cursor-pointer transition-colors duration-300" 
								/>
								<label 
									htmlFor="switch-darkmode" 
									className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-gray-700 cursor-pointer">
								</label>
							</div>
							<label htmlFor="switch-darkmode" className="text-slate-600 text-sm cursor-pointer">
								<p className="font-medium">Dark mode</p>
							</label>
						</div>
					</div>

		
					<div className="mt-6">{children}</div>
				</div>
			</div>
		</>
	);
};
