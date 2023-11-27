<template>
  <v-app-bar flat>
    <v-app-bar-title>
      TaskTrek
    </v-app-bar-title>
    <div class="font-weight-bold" style="margin-right: 20px;">{{name}}</div>
    <v-btn @click="handleSignOut" v-if="isLoggedIn" style="border-width:  1px;">Sair</v-btn>

  </v-app-bar>
</template>

<script lang="js" setup>
  import { onMounted, ref } from 'vue';
  import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
  import router from '@/router';
  import { useAppStore } from '@/store/app';

  const globalStore = useAppStore(); // Evite usar hooks diretamente aqui

  const isLoggedIn = ref(false);
  const name = ref('')

  let auth;
  onMounted(() => {
    auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(user) {
        isLoggedIn.value = true;
        name.value = globalStore.user.name;
      } else {
        isLoggedIn.value = false;
      }
    })
  });

  const handleSignOut = () => {
    signOut(auth).then(() => {
      globalStore.signOut();
      router.push("/auth");
    })
  };
</script>
