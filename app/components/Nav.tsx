import { Link } from "@remix-run/react"

interface NavProps {
    isAdmin?: boolean
}

export const Nav = ({ isAdmin = true } : NavProps) => {
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to="/translate">Translate</Link></li>
                        <li>
                            <details>
                                <summary>Tools</summary>
                                <ul className="p-2">
                                    <li><Link to={'/import'}>Import</Link></li>
                                    <li><Link to={'/export'}>Export</Link></li>
                                </ul>
                            </details>
                        </li>
                        {isAdmin && <li><Link to={'/admin'}>Admin</Link></li>}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl">i18n Collab</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/translate">Translate</Link></li>
                    <li>
                        <details>
                            <summary>Tools</summary>
                            <ul className="p-2">
                                <li><Link to={'/import'}>Import</Link></li>
                                <li><Link to={'/export'}>Export</Link></li>
                            </ul>
                        </details>
                    </li>
                    {isAdmin && <li><Link to={'/admin'}>Admin</Link></li>}
                </ul>
            </div>
            <div className="navbar-end">
                <Link to={'/logout'} className="btn">Logout</Link>
            </div>
        </div>
    )
}