export function CardPub({pubss}) {
    return (
        <div className="flex justify-between py-4 ">
            <div className="flex gap-6">
                <img src="file.svg" alt="" className="w-[30px] h-[40px]" />
                <div>
                    <a href={pubss.url} className="text-lg text-blue-600">{pubss.concierge}</a>
                    <p className="text-sm text-neutral-600">{pubss.institute}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-1">
                <p className="rounded px-4 text-white bg-green-600">{pubss.type}</p>
                <p className="rounded px-4 text-white bg-gray-500">{pubss.date}</p>
            </div>
        </div>
    )
}