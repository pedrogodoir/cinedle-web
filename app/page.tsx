"use client";
import Image from "next/image";
import { Modal } from "./components/modal/Modal";
import { useState } from "react";
export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg.png)] bg-cover bg-center">
			<header className="space-x-80px flex flex-col jus">
				
        <p>Cinedle</p>
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
					onClick={() => {
						setIsModalOpen(true);
					}}
				>
					{" "}
					Configurações{" "}
				</button>
			</header>

			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
				}}
			>
				<p></p>
			</Modal>

			<div className="flex items-center justify-center flex-1 gap-10 text-center">
				<div className="flex flex-col items-start bg-red-500 h-72 w-56 rounded-4xl shadow-xl p-4 gap-2 cursor-pointer hover:scale-105 transition-transform">
					<h1 className="text-3xl font-extrabold">Classico</h1>
					<p>lorem ipsum</p>
				</div>

				<div className="flex flex-col items-start bg-sky-500 h-72 w-56 rounded-4xl shadow-xl p-4 gap-2 cursor-pointer hover:scale-105 transition-transform">
					<h1 className="text-3xl font-extrabold">Poster</h1>
					<p>lorem ipsum</p>
				</div>
			</div>
		</div>
	);
}
