export const ACCOUNT_TYPES = ['LDAP', 'Локальная'] as const

export interface AccountLabel {
  text: string
}

export interface Account {
  labels: AccountLabel[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
}

export interface AccountStore {
  accounts: Account[]
}
