import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { signout, isAuthenticated } from '../auth'

const isActive = (history, path) => {
    if (history && history.location.pathname === path) {
        return { color: "#ff9900", 'borderColor': 'transparent' }
    } else {
        return { color: "#ffffff", 'borderColor': 'transparent' }
    }
}

const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
            </li>

            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/user/dashboard")} to="/user/dashboard">Dashboard</Link>
                </li>
            )}

            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/admin/dashboard")} to="/admin/dashboard">Dashboard</Link>
                </li>
            )}

            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Signin</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Signup</Link>
                    </li>
                </>
            )}

            {isAuthenticated() && (
                <li className="nav-item">
                    <span
                        className="nav-link"
                        style={{ cursor: "pointer", color: "#ffffff" }}
                        onClick={() => signout(() => {
                            history.push("/")
                        })}>
                        Signout
                            </span>
                </li>
            )}
        </ul>
    </div>
)

export default withRouter(Menu)