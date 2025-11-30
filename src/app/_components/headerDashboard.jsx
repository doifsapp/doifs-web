import Link from "next/link";

export function HeaderDashboard() {
    return (
        <header className="flex justify-center bg-white fixed w-full top-0 z-10 shadow-md">
            <div className="flex justify-between items-center w-6xl p-4">
                <img src="logo2-doifs.svg" alt="Logo Observatório Doifs" className="w-40" />
                <Link
                    href="/"
                    className="text-white px-6 py-2 rounded-sm bg-blue-800 inline-block">
                    Encerrar
                </Link>
            </div>
        </header>
    )
}