<template>
  <v-container>
    <v-row>
      <!-- Coluna do formulário -->
      <v-col cols="4">
        <v-card style="background-color: #1B263B !important">
          <v-card-title>Adicionar Tarefa</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addTask">
              <v-text-field v-model="newTask.title" label="Título" required></v-text-field>
              <v-textarea v-model="newTask.description" label="Descrição" required></v-textarea>
              <v-textarea v-model="newTask.comments" label="Comentários" required></v-textarea>
              <v-select v-model="newTask.priority" :items="priorities" label="Prioridade" required></v-select>
              <v-row justify="space-between" style="padding: 15px;">
                <v-btn @click="clearForm" color="red-darken-4">Limpar</v-btn>
                <v-btn type="submit" color="green-darken-4">Salvar</v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Coluna de tarefas pendentes -->
      <v-col cols="4">
        <v-card style="background-color: #1B263B !important;">
          <v-card-title>Pendentes</v-card-title>
          <v-card-text >
            <draggable v-model="pendingTasks" group="tasks" @end="updateTaskOrder" item-key="order">
              <template #item="{ element }">
                <v-card :key="element.id" style="margin-top: 20px;">
                  <v-card-title>{{ element.title }}</v-card-title>
                  <v-card-text>{{ element.description }}</v-card-text>
                  <v-card-subtitle>Prioridade: {{ element.priority }}</v-card-subtitle>
                  <br>
                  <v-card-subtitle>Comentários: {{ element.comments }}</v-card-subtitle>
                  <v-row justify="space-between" style="padding: 20px;">
                    <v-btn @click="editTask(element)" color="blue-darken-4">Editar</v-btn>
                    <v-btn @click="completeTask(element)" color="green-darken-4">Concluir</v-btn>
                  </v-row>
                </v-card>
              </template>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Coluna de tarefas concluídas -->
      <v-col cols="4">
        <v-card style="background-color: #1B263B !important">
          <v-card-title>Concluídas</v-card-title>
          <v-card-text>
            <v-card v-for="task in completedTasks" :key="task.id" style="margin-top: 20px;">
              <v-card-title>{{ task.title }}</v-card-title>
              <v-card-text>{{ task.description }}</v-card-text>
              <v-card-subtitle>Prioridade: {{ task.priority }}</v-card-subtitle>
              <br>
              <v-card-subtitle>Comentários: {{ task.comments }}</v-card-subtitle>
              <v-row justify="end" style="padding: 20px;">
                <v-btn @click="archiveTask(task)" color="grey-darken-4">Arquivar</v-btn>
              </v-row>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {Task} from '../types/task';
import apiService from '@/service/api.service';
import draggable from 'vuedraggable';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators'
import { reactive } from 'vue';
import { useAppStore } from '@/store/app';
import { onMounted } from 'vue';
import Swal from 'sweetalert2';
const globalStore = useAppStore();

const newTask = reactive({
  title: '',
  description: '',
  comments: '',
  priority: 'Normal',
  status: 'pending',
  user_id: globalStore.user.id,
  order: 0,
  id: 0,
});

const validations = {
  newTask: {
    title: { required, minLength: minLength(4), maxLength: maxLength(250) },
    description: { maxLength: maxLength(250) },
    comment: { maxLength: maxLength(250) }
  }
};

const v$ = useVuelidate(validations, { newTask });

const priorities = ref(['Normal', 'Urgente', 'Emergência']);
const pendingTasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);

const addTask = async () => {
  const result = await v$.value.$validate();
  if (result) {
    if(newTask.id > 0) {
      await apiService.updateTask(newTask.id || 0, newTask)
      .then(() => {
        fetchTasks();
        clearForm();
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
          title: "Tarefa editada com sucesso!"
        });
      })
      .catch((error) => {
        fetchTasks();
        console.error(error);
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
          icon: "error",
          title: "Ops... Ocorreu um erro ao salvar a alteração!"
        });
      });
    } else {
      apiService.createTask({...newTask, id: undefined})
      .then(() => {
        fetchTasks();
        clearForm();
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
          title: "Tarefa salva com sucesso!"
        });
      })
      .catch((error) => {
        fetchTasks();
        console.error(error);
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
          icon: "error",
          title: "Ops... Ocorreu um erro ao adicionar a tarefa!"
        });
      });
    }
  }
};

const clearForm = () => {
  // Lógica para limpar o formulário
    newTask.title = '';
    newTask.description = '';
    newTask.comments = '';
    newTask.priority = 'Normal';
    newTask.user_id = globalStore.user.id;
    newTask.order = 0;
    newTask.id = 0;
};

const editTask = async (task: Task) => {
  newTask.title = task.title;
  newTask.description = task.description;
  newTask.comments = task.comments;
  newTask.priority = task.priority;
  newTask.order = task.order || 0;
  newTask.id = task.id || 0;
};

const completeTask = async (task: Task) => {
  await apiService.updateTask(task.id || 0, {status: 'completed'})
  .then(() => {
    fetchTasks();
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
      title: "Tarefa concluída com sucesso!"
    });
  })
  .catch((error) => {
    fetchTasks();
    console.error(error);
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
      icon: "error",
      title: "Ops... Ocorreu um erro ao concluir a tarefa!"
    });
  });
};

const archiveTask = async (task : Task) => {
  await apiService.updateTask(task.id || 0, {status: 'archived'})
  .then(() => {
    fetchTasks();
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
      title: "Tarefa arquivada com sucesso!"
    });
  })
  .catch((error) => {
    console.error(error);
    fetchTasks();
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
      icon: "error",
      title: "Ops... Ocorreu um erro ao arquivar a tarefa!"
    });
  });
};

const updateTaskOrder = () => {
  const newOrders = pendingTasks.value.map((task, index) => ({
    taskId: task.id,
    order: index + 1 // Adapte para a base de ordem do seu banco de dados (começando em 1, 0, etc.)
  }));
  apiService.updateOrder(newOrders);
};

const fetchTasks = async () => {
  await apiService.getTasks()
  .then((result: any) => {
    pendingTasks.value = result.pendingTasks;
    completedTasks.value = result.completedTasks;
  })
  .catch((error) => {
    console.error(error);
  })
}

onMounted(() => {
  fetchTasks();
});
</script>

<style lang="scss">
  .home {
    display: flex;
    height: 92vh;
    padding: 15px;
  }
</style>
