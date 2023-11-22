<template>
  <div class="register-form">


    <form @submit.prevent="register" novalidate>
      <v-text-field class="field" v-model="state.name"
        :error-messages="v$.name.$errors.map(e => 'Preencha o nome corretamente')" :counter="250" label="Nome" required
        @input="v$.name.$touch" @blur="v$.name.$touch"></v-text-field>

      <v-text-field class="field" v-model="state.surname"
        :error-messages="v$.surname.$errors.map(e => 'Preencha o sobrenome corretamente')" :counter="250"
        label="Sobrenome" required @input="v$.surname.$touch" @blur="v$.surname.$touch"></v-text-field>

      <v-text-field class="field" v-model="state.email"
        :error-messages="v$.email.$errors.map(e => 'Preencha o e-mail corretamente')" label="E-mail" required
        @input="v$.email.$touch" @blur="v$.email.$touch"></v-text-field>

      <v-text-field class="field" v-model="state.password" label="Senha" required type="password"
        @input="v$.password.$touch" @blur="v$.password.$touch"></v-text-field>
      <span style="font-size: 14px; font-style: italic;" v-for="(item, index) in getPasswordErrorMessages()" :key="index"
        v-html="item"></span>

      <v-container style="margin-top: 30px;">
        <v-row justify="space-around">
          <v-btn type="submit" height="45" width="130" :disabled="isLoading">
            <template v-if="isLoading">
              <v-progress-circular indeterminate color="grey"></v-progress-circular>
            </template>
            <template v-else>
              Registrar-se
            </template>
          </v-btn>
          <v-btn height="45" @click="googleRegister">
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
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import apiService from '@/service/api.service';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, getAuth} from "firebase/auth";
import { auth } from "../../service/firebase";

const router = useRouter();
const isLoading = ref(false);
const isLoadingPopUp = ref(false);

const initialState = {
  name: '',
  surname: '',
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
  name: { required },
  surname: { required },
  email: { required, email },
  password: { required, validatePassword },
}

const getPasswordErrorMessages = () => {
  const messages = [];
  const password = state.password;
  if (!validatePassword(password)) {
    if (password.length < 8) {
      messages.push('<span>A senha deve ter pelo menos 8 caracteres</span><br>');
    }

    if (!/[A-Z]/.test(password)) {
      messages.push('<span>A senha deve conter pelo menos uma letra maiúscula</span><br>');
    }

    if (!/[a-z]/.test(password)) {
      messages.push('<span>A senha deve conter pelo menos uma letra minúscula</span><br>');
    }

    if (!/[0-9]/.test(password)) {
      messages.push('<span>A senha deve conter pelo menos um número</span><br>');
    }

  }
  return messages;
};



const v$ = useVuelidate(rules, state)

const register = async () => {
  isLoading.value = true;
  const result = await v$.value.$validate()
  if (result) {
    createUserWithEmailAndPassword(getAuth(), state.email, state.password)
    .then((result) => {
      apiService.register({ email: state.email, name: state.name + ' ' + state.surname, password: undefined, google_uid: result.user.uid }).then(async () => {
        const ret = await login({ email: state.email, google_uid: result.user.uid })

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
            title: "Conta Criada com Sucesso!"
          });
          router.push({ path: '/' });
        }
      }).catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Ops.. Ocorreu um erro!",
          text: "Verifique as informações e tente novamente!",
          icon: "error",
          confirmButtonColor: 'red'
        }).then(() => isLoading.value = false);
      });
    })
    .catch((error) => {
      console.log(error);
      let errTitle = '';
      let errMsg = '';
      switch (error.code) {
        case "auth/email-already-in-use":
          errTitle = 'E-mail ja utilizado';
          errMsg = 'Realize o login ou utilize outro e-mail!';
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

    });
  }

  isLoading.value = false;
}

const login = async (data: object) => {
  return await apiService.login(data).then((response: any) => {
    localStorage.setItem('access_token', response.access_token);
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  })
}

const googleRegister = () => {
  const provider = new GoogleAuthProvider();
  isLoadingPopUp.value = true;
  signInWithPopup(auth, provider)
  .then((result) => {
    apiService.register({ email: result.user.email, name: result.user.displayName, google_uid: result.user.uid })
    .then(async () => {
      const ret = await login({ email: state.email, google_uid: result.user.uid });

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
          title: "Conta Criada com Sucesso!"
        });
        router.push({ path: '/' });
      }
    }).catch((err) => {
      console.log(err);
      Swal.fire({
        title: "Ops.. Ocorreu um erro!",
        text: "Verifique as informações e tente novamente!",
        icon: "error",
        confirmButtonColor: 'red'
      }).then(() => isLoadingPopUp.value = false);
    });
  })
  .catch((error) => {
    console.log(error);
    Swal.fire({
      title: "Ops.. Ocorreu um erro!",
      text: "Verifique as informações e tente novamente!",
      icon: "error",
      confirmButtonColor: 'red'
    }).then(() => isLoadingPopUp.value = false);
  });

  isLoading.value = false;
}


</script>


<style lang="scss">
.register-form {
  width: 95%;
}

.field {
  margin-top: 10px;
  margin-bottom: 0px;
}
</style>
