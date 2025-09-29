<script setup lang="ts">
  import type { Account } from '@/types/account'
  import { useAccountStore } from '@/stores/account'

  const accountStore = useAccountStore()

  const isDraftAccountAdded = ref<boolean>(false)

  const accountList = computed(() => {
    return isDraftAccountAdded.value
      ? [...accountStore.getAccounts, null]
      : accountStore.getAccounts
  })

  function handleClickAddAccount () {
    isDraftAccountAdded.value = true
  }

  function handleDeleteAccount (login: string, isDraft = false) {
    if (isDraft) {
      isDraftAccountAdded.value = false
    } else {
      accountStore.deleteAccount(login)
    }
  }

  function handleUpsertAccount (login: string | undefined, account: Account, isDraft = false) {
    if (isDraft) {
      isDraftAccountAdded.value = false
    }
    accountStore.upsertAccount(login, account)
  }
</script>

<template>
  <v-container class="pa-4" fluid>
    <v-card color="#f5f5f5" variant="flat">
      <v-card-title>
        Учётные записи
      </v-card-title>
      <v-card-text>
        <template v-if="accountList.length > 0">
          <div class="d-flex flex-column ga-4">
            <AccountItem
              v-for="(account, index) in accountList"
              :key="index"
              :account="account"
              @delete-account="handleDeleteAccount"
              @upsert-account="handleUpsertAccount"
            />
          </div>
        </template>
        <template v-else>
          <v-alert
            type="info"
            variant="outlined"
          >
            Список аккаунтов пуст
          </v-alert>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="isDraftAccountAdded"
          variant="flat"
          @click="handleClickAddAccount"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped lang="sass">

</style>
