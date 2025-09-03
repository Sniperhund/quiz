import { type RefObject } from "react"
import styles from "./option.module.scss"
import { Check, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

interface QuestionProps {
    onClick?: () => void
    ref?: RefObject<HTMLDivElement>
    i: number // <-- Index of question in array
    option: any
    correct: boolean | undefined
}

const CorrectIndicator = ({ correct }: { correct: boolean }) => {
    if (correct) return <Check className={styles.correct} strokeWidth={4} />
    return <X className={styles.wrong} strokeWidth={4} />
}

/**
 * This component handles the border
 */
export const Option = ({ onClick, ref, i, option, correct }: QuestionProps) => {
    return <div className={styles.question} onClick={onClick} ref={ref}>
        <p>{String.fromCharCode("A".charCodeAt(0) + i)}</p>
        <p>{option.text}</p>

        {/* This is so inefficient to install framer motion for this. But laziness prevails */}
        <AnimatePresence>
            {correct != undefined && 
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ marginLeft: "auto" }}>
                    <CorrectIndicator correct={correct} />
                </motion.div>
            }
        </AnimatePresence>
    </div>
}
