import Link from 'next/link'

const options = [
    { label: 'Home', id: '/' },
    { label: 'Serviços', id: 'services' },
    { label: 'Contato', id: 'contact' },
    { label: 'Sobre', id: 'about' },
];

export function Header() {
    return (
        <header className="flex justify-center">
            <div className="flex justify-between items-center w-6xl pt-5">
                <img src="logo2-doifs.svg" alt="Logo Conect Cursos" className="w-[200px] h-[100px]" />
                <nav>
                    <ul className="flex  items-center gap-6 text-black">
                        {
                            options.map((options, index) => (
                                <li key={index}>
                                    <a
                                        href={options.id}
                                        className="relative inline-block 
                                        before:content-[''] 
                                        before:absolute 
                                        before:bottom-0 
                                        before:left-0 
                                        before:h-[2px] 
                                        before:w-0 
                                        before:bg-green-700 
                                        before:transition-all 
                                        before:duration-300 
                                        hover:before:w-full"
                                    >
                                        {options.label}
                                    </a>
                                </li>

                            ))

                            
                        }
                        <li>
                            <Link
                                href="/dashboard"
                                className="text-white px-6 py-2 rounded-2xl bg-blue-800 inline-block">
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

//pb-1 