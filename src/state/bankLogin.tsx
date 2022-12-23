import { createContext } from "react";
const BANK_NAMES = [
    "Bank of Republic",
    "Belieber Bank",
    "Buried and Me National Bank",
    "End of the World as we Grow It Financial",
    "Fade to Black Credit Union",
    "Banco de Hotel California"
]
export const generateInitialData = () => {
    return BANK_NAMES.map(v => ({
        bankName: v,
        isLoggedIn: false
    }))
}
export interface BankLoginType {
    bankName: string,
    isLoggedIn: boolean
}

export const BankLogin = createContext<BankLoginType[]>([]);