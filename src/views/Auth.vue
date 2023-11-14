<template>
  <main class="login-page">
    <div class="left-login">
      <div class="blob"></div>
      <h1>Aqui, suas Tarefas são a <br> Estrela Principal!</h1>
      <img class="left-login-img" src="../assets/to-do-list-animate.svg" alt="Pessoa">
    </div>

    <div class="right-login">
      <div class="box">
        <v-container>
          <v-row justify="space-around">
            <v-btn variant="text" size="x-large" @click="selectComponent('LOGIN')" >
              Login
              <span :class="{ 'active': component === 'LOGIN' }">   </span>
            </v-btn>

            <v-btn variant="text" size="x-large" @click="selectComponent('REGISTER')">
              Registrar
              <span :class="{ 'active': component === 'REGISTER' }">   </span>
            </v-btn>
          </v-row>
        </v-container>

        <Login v-if="component === 'LOGIN'"/>
        <Register v-if="component === 'REGISTER'"/>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import Login from '@/components/login/Login.vue'
  import Register from '@/components/register/Register.vue'

  document.body.classList.add('no-theme-change');

  const component = ref("LOGIN")

  function selectComponent(value: string) {
    component.value = value;
  }
</script>

<style lang="scss">
  .login-page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .left-login {
    width: 50vw;
    height: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      font-size: 3vw;
    }

    img {
      width: 30vw;
    }
  }

  .right-login {
    width: 50vw;
    display: flex;
    height: 100vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .box {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30px 35px;
    background-color: #B2B2A9 !important;
    border-radius: 20px;
    box-shadow: 0px 20px 25px #00000056;
    z-index: 2;
  }

  .active {
    position: absolute;
    left: 10%;
    right: 0;
    bottom: 5px; /* Ajuste conforme necessário para a espessura desejada */
    height: 2px; /* Ajuste conforme necessário para a altura desejada */
    width: 80%;
    background-color: white;
  }

  .blob {
    position: absolute;
    width: 500px;
    height: 500px;
    background: linear-gradient(
      180deg,
    rgba(47, 184, 255) 31.77%,
    #0d4da0 100%
    );
    mix-blend-mode: color-dodge;
    -webkit-filter: blur(0px);
    filter: blur(50px);
    box-shadow:
      inset 100px 100px 0 0px #57464c,
      inset 200px 200px 0 0px #76658a,
      inset 400px 400px 0 0px #5b7486;
    -webkit-animation: move 25s infinite alternate;
    animation: move 25s infinite alternate;
    transition: 1s cubic-bezier(0.07, 0.8, 0.16, 1);
    z-index: 0;
  }

  @-webkit-keyframes move {
    from {
      transform: translate(-100px, -50px) rotate(-90deg);
      border-radius: 24% 76% 35% 65% / 27% 36% 64% 73%;
    }

    to {
      transform: translate(500px, 100px) rotate(-10deg);
      border-radius: 76% 24% 33% 67% / 68% 55% 45% 32%;
    }
  }

  @keyframes move {
    from {
      transform: translate(-100px, -50px) rotate(-90deg);
      border-radius: 24% 76% 35% 65% / 27% 36% 64% 73%;
    }

    to {
      transform: translate(500px, 100px) rotate(-10deg);
      border-radius: 76% 24% 33% 67% / 68% 55% 45% 32%;
    }
  }

  @media only screen and (max-width: 1000px) {
    .login-page {
      flex-direction: column;
    }

    .left-login {
      width: 100%;
      height: auto;

      h1 {
        display: none;
      }

      img {
        width: 50vw;
      }
    }

    .right-login {
      width: 100%;
      height: auto;
    }

    .box {
      width: 80%;
    }
  }
</style>
