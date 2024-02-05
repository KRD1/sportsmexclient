import Home from "../pages/home"
import Login from "../pages/login"
import GameDetails from "../pages/gameDetails"

const authProtectedRoutes = [
    {
        path: "/",
        exact: true,
        component: <Home />,
    },
    {
        path: "/gamedetails",
        exact: true,
        component: <GameDetails />,
    },
    
]

const publicRoutes = [
    { path: "/login", component: <Login /> },
]

export { authProtectedRoutes, publicRoutes }