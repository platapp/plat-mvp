
export const getCustomerInfo = () => fetch("/customer").then(r => r.json())
export const getTransactionInfo = () => fetch("/transactions").then(r => r.json())
export const getAccountInfo = () => fetch("/accounts").then(r => r.json())
export const getRewards = () => fetch("/rewards").then(r => r.json())