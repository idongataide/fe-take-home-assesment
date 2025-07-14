<script setup lang="ts">
import Images from '@/components/Images';
import { useRouter } from 'vue-router';
import { ref } from 'vue';


const router = useRouter();
const formState = ref({
  email: '',
  password: ''
});

function login() {
  router.push({ name: 'Home' });
}
</script> 

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-sm w-full max-w-sm">
      <div class="flex flex-col items-center mb-3">
        <div class="logo text-white font-bold text-xl mt-3 flex items-center gap-2">
            <img :src="Images.logodark" alt="logo" class="w-[120px]" />
        </div>
        <h1 class="text-2xl font-bold mt-6 mb-1">Welcome Back</h1>
        <p class="text-gray-500">Please log in to continue</p>
      </div>
      <a-form layout="vertical" class="mb-1">
        <a-form-item label="Email" class="mb-2">
          <a-input v-model:value="formState.email" class="h-[43px]" placeholder="Enter your email" type="email" />
        </a-form-item>
        <a-form-item label="Password">
          <a-input v-model:value="formState.password" class="h-[43px]" placeholder="Enter your password" type="password" />
        </a-form-item>
      </a-form>
      <button
        @click="login"
        class="w-full bg-[#27CD93] h-[43px] hover:bg-[#27CD93] text-white text-md! font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Login
      </button>
    </div>
  </div>
</template>

