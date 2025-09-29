<script setup lang="ts">
  import { computed } from 'vue'
  import { VForm } from 'vuetify/components'
  import { useAccountStore } from '@/stores/account'
  import { type Account, ACCOUNT_TYPES } from '@/types/account'

  const accountStore = useAccountStore()

  const emit = defineEmits<{
    'delete-account': [login: string, isDraft?: boolean]
    'upsert-account': [login: string | undefined, account: Account, isDraft?: boolean]
  }>()

  const props = defineProps<{
    account: Account | null
  }>()

  const tempAccount = reactive<Account>({
    login: '',
    password: null,
    type: ACCOUNT_TYPES[0],
    labels: [],
  })

  const accountForm = ref<typeof VForm | null>(null)

  const isDraftAccount = ref<boolean>(false)

  const isFormValid = ref<boolean>(false)

  onMounted(() => {
    if (props.account) {
      tempAccount.labels = props.account.labels
      tempAccount.login = props.account.login
      tempAccount.password = props.account.password
      tempAccount.type = props.account.type
    } else {
      isDraftAccount.value = true
    }
  })

  const isLocal = computed(() => tempAccount.type === 'Локальная')

  const labelString = computed({
    get: () => tempAccount.labels.map(label => label.text).join('; '),
    set: (val: string) => {
      tempAccount.labels = val.split(';').map(s => ({ text: s.trim() }))
    },
  })

  const rules = computed(() => {
    return {
      label: [
        (v: string) => !v || v.length <= 50 || 'Максимум 50 символов',
      ],
      login: [
        (v: string) => !!v || 'Логин обязателен',
        (v: string) => v?.length >= 3 || 'Минимум 3 символа',
        (v: string) => v?.length <= 50 || 'Максимум 50 символов',
        (v: string) => {
          if (!v || v === props.account?.login) return true
          const existingAccount = accountStore.getAccountByLogin(v)
          return !existingAccount || 'Логин уже используется'
        },
      ],
      password: [
        (v: string) => {
          if (!isLocal.value) return true
          return (!!v && v.length > 0) || 'Пароль обязателен для локального типа'
        },
        (v: string) => !v || v.length <= 100 || 'Максимум 100 символов',
      ],
    }
  })

  function handleClickDeleteAccount () {
    emit('delete-account', tempAccount.login, isDraftAccount.value)
  }

  function handleValidationUpdated (isValid: boolean | null) {
    if (isValid) {
      emit('upsert-account', props.account?.login, { ...tempAccount }, isDraftAccount.value)
      isDraftAccount.value = false
    }
  }

  function handleFieldFocused (isFocused: boolean) {
    if (isFormValid.value === null) accountForm.value?.validate()
    if (!isFocused && isFormValid.value) {
      emit('upsert-account', props.account?.login, { ...tempAccount }, isDraftAccount.value)
      isDraftAccount.value = false
    }
  }

  function handleAccountTypeUpdated (val: string) {
    if (val !== 'Локальная') {
      tempAccount.password = null

      if (isFormValid.value === null) accountForm.value?.validate()
      if (isFormValid.value) {
        emit('upsert-account', props.account?.login, { ...tempAccount }, isDraftAccount.value)
        isDraftAccount.value = false
      }
    }
  }
</script>

<template>
  <v-card color="white" variant="flat">
    <v-card-text class="pt-8">
      <v-form
        ref="accountForm"
        v-model="isFormValid"
        validate-on="blur"
        @update:model-value="handleValidationUpdated"
      >
        <v-row align="end">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="labelString"
              counter
              hint="Разделяйте метки точкой с запятой"
              label="Метка"
              maxlength="50"
              :rules="rules.label"
              variant="outlined"
              @update:focused="handleFieldFocused"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="tempAccount.type"
              :items="ACCOUNT_TYPES"
              label="Тип"
              variant="outlined"
              @update:model-value="handleAccountTypeUpdated"
            />
          </v-col>
          <v-col cols="12" :md="!isLocal ? 6 : 3">
            <v-text-field
              v-model="tempAccount.login"
              autocomplete="login"
              counter
              label="Логин"
              maxlength="50"
              :rules="rules.login"
              variant="outlined"
            />
          </v-col>
          <v-col v-if="isLocal" cols="12" md="3">
            <v-text-field
              v-model="tempAccount.password"
              autocomplete="password"
              counter
              label="Пароль"
              maxlength="100"
              :rules="rules.password"
              type="password"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="1">
            <v-btn
              block
              class="mb-8"
              color="red"
              flat
              @click="handleClickDeleteAccount"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="sass">

</style>
