import type { Account, AccountStore } from '@/types/account'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: (): AccountStore => ({
    accounts: [],
  }),
  getters: {
    getAccounts (state): readonly Account[] {
      return state.accounts
    },
    getAccountByLogin: state => {
      return (login: string): Account | undefined => {
        return state.accounts.find(acc => acc.login === login)
      }
    },
  },
  actions: {
    deleteAccount (login: string): void {
      const index = this.accounts.findIndex(acc => acc.login === login)
      if (index === -1) {
        throw new Error('Аккаунт не найден')
      }
      this.accounts.splice(index, 1)
    },
    upsertAccount (login: string | undefined, account: Account): void {
      const index = this.accounts.findIndex(acc => acc.login === login)
      if (index === -1) {
        this.accounts.push(account)
      } else {
        this.accounts[index] = account
      }
    },
  },
})
