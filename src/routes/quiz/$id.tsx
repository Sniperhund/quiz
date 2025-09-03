import { createFileRoute, useNavigate } from '@tanstack/react-router'
import styles from "./quiz.module.scss"
import questionStyles from "@/components/option.module.scss"
import { Option } from '@/components/option'
import { useEffect, useRef, useState } from 'react'
import { baseUrl, question2Id } from '@/util'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'sonner'

export const Route = createFileRoute('/quiz/$id')({
    component: Quiz,
    loader: async ({ params }) => {
        const quiz = await fetch(`${baseUrl}quiz/${params.id}`)

        if (!quiz.ok) return null

        const json = await quiz.json()

        if (json.status != "ok") return null

        return { quiz: json.data }
    }
})

function Quiz() {
    const data = Route.useLoaderData()
    const { id } = Route.useParams()
    const refs = useRef<Array<HTMLDivElement | null>>([])
    const navigate = useNavigate()
    const [userId, setUserId, removeUserId] = useLocalStorage("user-id", null)
    const [correctAnswer, setCorrectAnswer] = useState("")

    useEffect(() => {
        if (!userId && id) navigate({ to: "/", search: { to: `/quiz/${id}` }})
    }, [userId, id])

    useEffect(() => {
        if (!data) return

        refs.current = refs.current.slice(0, data.quiz.options.length);
    }, [data?.quiz])

    const [chosenAnswer, setChosenAnswer] = useState("")

    const clickHandler = (i: number, id: string) => {
        if (!refs.current[i] || correctAnswer != "") return

        setChosenAnswer(id)

        refs.current.forEach((val) => {
            if (!val) return

            val.classList.remove(questionStyles.active)
        })

        refs.current[i]?.classList.add(questionStyles.active)
    }

    const submit = async () => {
        if (chosenAnswer == "") {
            toast.warning("Du skal vælge en af valgmulighederne")
            return
        }

        if (correctAnswer != "") return // Don't let the user press the button again, if they already have answered

        const response = await fetch(`${baseUrl}quiz/${id}/answer`, {
            method: "POST",
            body: JSON.stringify({
                optionId: chosenAnswer,
                userId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            toast.error("Der skete en fejl. Prøv igen")
        }

        setCorrectAnswer(data?.quiz.correctOptionId)
    }

    const calculateCorrectness = (option: any) => {
        if (correctAnswer == "") return undefined
        if (option._id == chosenAnswer) return correctAnswer == option._id
        if (option._id == correctAnswer) return true
    }

    if (!data) return <></>

    return <section className={styles.quiz}>
        <h1>Hvor gammel er skolen?</h1>

        <article className={styles.questions}>
            {data.quiz.options.map((option: any, i: number) => <Option key={option._id} ref={(el) => refs.current[i] = el} onClick={() => clickHandler(i, option._id)} i={i} option={option} correct={calculateCorrectness(option)} />)}
        </article>

        {correctAnswer ?
            <article className={styles.feedback}>
                <p>Du svarede {chosenAnswer == correctAnswer ? "rigtigt" : "forkert"}</p>

                {correctAnswer == chosenAnswer &&
                    <>
                        <br />
                        {(data.quiz.image || data.quiz.hint) && <p>Hint:</p>}
                        {data.quiz.image && <img src={data.quiz.image} />}
                        {data.quiz.hint && <p>{data.quiz.hint}</p>}
                    </>}

                <button onClick={() => navigate({ to: `/quiz/${question2Id}`})} className="mt-3">Gå til næste spørgsmål</button>
            </article>
            :
            <button onClick={submit}>Svar spørgsmål</button>}
    </section>
}
