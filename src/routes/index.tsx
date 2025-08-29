import { createFileRoute } from "@tanstack/react-router"
import logo from "../logo.svg"
import "../App.css"

export const Route = createFileRoute("/")({
    component: App,
})

function App() {
    return <></>
}
