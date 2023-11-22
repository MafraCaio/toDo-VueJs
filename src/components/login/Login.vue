<template>
  <div class="login-form">
    <form @submit.prevent="googleSignInWithEmailPassword" novalidate>
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
          <v-btn height="45" @click="googleSignInWithPopup">
            <template v-if="isLoadingPopUp">
              <v-progress-circular indeterminate color="grey"></v-progress-circular>
            </template>
            <template v-else>
              <img src="../../assets/google.svg" width="25" typeof="svg"> Entrar com o Google
            </template>
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
  import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
  import { auth } from "../../service/firebase";
  import apiService from '@/service/api.service';

  const router = useRouter();
  const isLoading = ref(false);
  const isLoadingPopUp = ref(false)

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

  const googleSignInWithPopup = () => {
    isLoadingPopUp.value = true;
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
    .then(async (result) => {
      const ret = await login({ email: result.user.email, google_uid: result.user.uid })
      if(ret) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Login efetuado com sucesso!"
        });
        router.push({ path: '/'});
      } else {
        Swal.fire({
          title: "Usuário/Senha Incorreto",
          text: "Verifique as informações e tente novamente!",
          icon: "warning",
          confirmButtonColor: 'red'
        }).then(() => isLoadingPopUp.value = false);
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        title: "Usuário/Senha Incorreto",
        text: "Verifique as informações e tente novamente!",
        icon: "warning",
        confirmButtonColor: 'red'
      }).then(() => isLoadingPopUp.value = false);
    });
  }

  const googleSignInWithEmailPassword = () => {
    isLoading.value = true;
    signInWithEmailAndPassword(auth, state.email, state.password)
    .then(async (result) => {

      const ret = await login({ email: result.user.email, google_uid: result.user.uid })
      if(ret) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Login efetuado com sucesso!"
        });
        router.push({ path: '/'});
      } else {
        Swal.fire({
          title: "Usuário/Senha Incorreto",
          text: "Verifique as informações e tente novamente!",
          icon: "warning",
          confirmButtonColor: 'red'
        }).then(() => isLoading.value = false);
      }
    })
    .catch((error) => {
      let errTitle = '';
      let errMsg = '';
      switch (error.code) {
        case "auth/invalid-login-credentials":
          errTitle = 'Conta não encontrada';
          errMsg = 'Nenhuma conta encontrada com esse email!';
          break;
        default:
          errTitle = 'Usuário/Senha Incorreto';
          errMsg = 'Verifique as informações e tente novamente!';
          break;
      }

      Swal.fire({
        title: errTitle,
        text: errMsg,
        icon: "warning",
        confirmButtonColor: 'red'
      }).then(() => isLoading.value = false);
    })
  }

  const login = async (data: object) => {
    return await apiService.login(data).then((response: any) => {
      localStorage.setItem('access_token', response.access_token);
      return true;
    }).catch((err) => {
      console.log(err);
      return false;
    });
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
