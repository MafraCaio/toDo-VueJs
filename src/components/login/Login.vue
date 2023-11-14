<template>
  <div class="login-form">
    <form @submit.prevent="login" novalidate>
      <v-text-field
        class="field"
        v-model="state.email"
        :error-messages="v$.email.$errors.map(e => 'Preencha o e-mail corretamente')"
        label="E-mail"
        required
        @input="v$.email.$touch"
        @blur="v$.email.$touch"
      ></v-text-field> 

      <v-text-field
        class="field"
        v-model="state.password"
        label="Senha"
        type="password"
        required
        @input="v$.password.$touch"
        @blur="v$.password.$touch"
      ></v-text-field> 


      <v-container style="margin-top: 30px;"> 
        <v-row justify="space-around">
          <v-btn type="submit" height="45" width="130" :disabled="isLoading">
            <template v-if="isLoading">
              <v-progress-circular indeterminate color="grey"></v-progress-circular>
            </template>
            <template v-else>
              Entrar
            </template>
          </v-btn>
          <v-btn height="45">
            <img src="../../assets/google.svg" width="25" typeof="svg"> Entrar com o Google
          </v-btn>
        </v-row>
      </v-container>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { email, required } from '@vuelidate/validators'
  import { useRouter } from 'vue-router';
  import Swal from 'sweetalert2';

  const router = useRouter();
  const isLoading = ref(false);

  const initialState = {
    email: '',
    password: '',
  }

  const state = reactive({
    ...initialState,
  })

  const validatePassword = (value: string) => {
    const hasMinimumLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    return hasMinimumLength && hasUppercase && hasLowercase && hasNumber;
  };

  const rules = {
    email: { required, email },
    password: { required, validatePassword },
  }

  const v$ = useVuelidate(rules, state);

  const login = async () => {
    isLoading.value = true;
    const result = await v$.value.$validate();
    if(result) {

    } else {
      Swal.fire({
        title: "Usuário/Senha Incorreto",
        text: "Verifique as informações e tente novamente!",
        icon: "warning",
        confirmButtonColor: 'red'
      }).then(() => isLoading.value = false);
    }
  }
</script>


<style lang="scss">
  .login-form { 
    width: 95%;
  }

  .field {
    margin-top: 10px;
    margin-bottom: 0px;
  }
</style>