<script setup>
import { ref, useTemplateRef, onMounted } from 'vue';
import axios from 'axios';

// Referências e estados
const newName = ref('');
const newNickname = ref('');
const newEmail = ref('');
const newPassword = ref('');
const newPhoto = ref(null); // Para armazenar a foto/avatar
const nicknameInput = useTemplateRef('nicknameinput');

// Função para criar um novo utilizador
const createUser = async () => {
  if (
    newName.value.trim() &&
    newNickname.value.trim() &&
    newEmail.value.trim() &&
    newPassword.value.trim()
  ) {
    const formData = new FormData();
    formData.append('name', newName.value);
    formData.append('nickname', newNickname.value);
    formData.append('email', newEmail.value);
    formData.append('password', newPassword.value);
    if (newPhoto.value) {
      formData.append('photo', newPhoto.value);
    }

    try {
      const response = await axios.post('/api/admin/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`Utilizador criado com sucesso: ${response.data.nickname}`);
      // Limpar os campos após criar o utilizador
      newName.value = '';
      newNickname.value = '';
      newEmail.value = '';
      newPassword.value = '';
      newPhoto.value = null;
      nicknameInput.value.focus();
    } catch (error) {
      console.error('Erro ao criar utilizador:', error);
      alert(
        error.response?.data?.message ||
          'Erro ao criar utilizador. Verifica os campos e tenta novamente.'
      );
    }
  } else {
    alert('Por favor, preencha todos os campos obrigatórios.');
  }
};

// Configuração inicial
onMounted(() => {
  nicknameInput.value.focus();
});
</script>

<template>
  <div class="py-4">
    <h1 class="text-2xl font-bold mb-4">Registar Novo Utilizador</h1>
    <form @submit.prevent="createUser" enctype="multipart/form-data">
      <!-- Nome -->
      <div class="mb-4">
        <label for="name" class="font-medium">Nome</label>
        <input
          type="text"
          id="name"
          class="w-full p-2 border rounded-lg"
          v-model="newName"
          required
        />
      </div>

      <!-- Nickname -->
      <div class="mb-4">
        <label for="nickname" class="font-medium">Nickname</label>
        <input
          ref="nicknameinput"
          type="text"
          id="nickname"
          class="w-full p-2 border rounded-lg"
          v-model="newNickname"
          required
        />
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="font-medium">Email</label>
        <input
          type="email"
          id="email"
          class="w-full p-2 border rounded-lg"
          v-model="newEmail"
          required
        />
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label for="password" class="font-medium">Password</label>
        <input
          type="password"
          id="password"
          class="w-full p-2 border rounded-lg"
          v-model="newPassword"
          required
        />
      </div>

      <!-- Foto ou Avatar -->
      <div class="mb-4">
        <label for="photo" class="font-medium">Foto/Avatar (opcional)</label>
        <input
          type="file"
          id="photo"
          class="w-full p-2 border rounded-lg"
          @change="(e) => (newPhoto.value = e.target.files[0])"
        />
      </div>

      <!-- Botão para criar -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Criar Utilizador
        </button>
      </div>
    </form>
  </div>
</template>

