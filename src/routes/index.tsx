import { createFileRoute, useNavigate } from "@tanstack/react-router"
import styles from "./index.module.scss"
import { useForm, type SubmitHandler } from "react-hook-form"
import { baseUrl } from "@/util"
import { useLocalStorage } from "usehooks-ts"
import { useEffect } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/")({
    component: App,
    validateSearch: (search) => {
        return { to: search.to as string }
    }
})

interface IFormInput {
    name: string
}

function App() {
    const { register, handleSubmit } = useForm<IFormInput>()
    const [userId, setUserId, removeUserId] = useLocalStorage("user-id", null)
    const navigate = useNavigate()
    const { to } = Route.useSearch()

    useEffect(() => {
        if (userId && to) {
            navigate({ to })
        }
    }, [userId])

    const submit: SubmitHandler<IFormInput> = async (data) => {
        if (!data.name) {
            toast.error("Du skal skrive et navn")
            return
        }

        let response = await fetch(`${baseUrl}user`, {
            method: "POST",
            body: JSON.stringify({
                name: data.name
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.status == 409) {
            // The user already exists, so we have to do a hack to get the user id
            response = await fetch(`${baseUrl}users`)

            if (!response.ok) {
                toast.error("Der skete en fejl. Prøv igen")
                return
            }

            const json = await response.json()

            const user = json.data.find((user: any) => user.name == data.name)

            setUserId(user._id)
            navigate({ to })

            toast.success("Du er nu logget ind. Scan en QR-kode")

            return
        }

        if (!response.ok) {
            toast.error("Der skete en fejl. Prøv igen")
            return
        }
        
        const json = await response.json()

        setUserId(json.data._id)
        navigate({ to })

        toast.success("Du er nu logget ind. Scan en QR-kode")
    }

    return <div className="flex justify-center items-center h-screen">
        <article className={styles.signUpCard}>
            <h1>Deltag i quiz</h1>

            <form onSubmit={handleSubmit(submit)}>
                <label>Navn</label>
                <input placeholder="Skriv dit navn" {...register("name")} />

                <button type="submit">Tilmeld dig</button>
            </form>
        </article>
    </div>
}
