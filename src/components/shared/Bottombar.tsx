// import React from 'react'
import { bottombarLinks } from "@/constants"
import {Link, useLocation} from "react-router-dom"

const Bottombar = () => {
    const {pathname} = useLocation()

    return (
        <section className="bottom-bar">
            {
                bottombarLinks.map((link) => (
                    <Link key={link.label} to={link.route} className={`${pathname === link.route && "bg-primary-500 rounded-[10px]"} flex-center flex-col gap-1 p-2 transition`}>
                        <img src={link.imgURL} alt={link.label} width={16} height={16} className={`${pathname === link.route && "invert-white"}`} />
                        <p className="tiny-medium text-light-2">{link.label}</p>
                    </Link>
                ))
            }

        </section>
    )
}

export default Bottombar