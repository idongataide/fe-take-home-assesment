<script setup lang="ts">
import { Dropdown, Menu } from 'ant-design-vue';
import { DownOutlined, PlusOutlined } from '@ant-design/icons-vue';
import Images from './Images';
import { useRouter } from 'vue-router';
import { LogOut } from 'lucide-vue-next';


const menuItems = [
  { key: '1', label: 'New School' },
  { key: '2', label: 'New Device' },
  { key: '3', label: 'New Battery Report' },
];


const router = useRouter();
function handleLogout() {
  router.push({ name: 'Login' });
}
</script>

<template>
  <div class="h-[394px] py-4 px-20  bg-dash rounded-b-3xl">
    <div class="flex justify-between items-end"> 
      <div class="flex items-center gap-8">
        <div class="logo text-white font-bold text-xl flex items-center gap-2">
            <img :src="Images.logo" alt="logo" class="w-[140px]" />
        </div>
        <nav class="flex gap-6 text-white font-medium">
          <a href="#">Dashboard</a>
          <a href="#">Schools</a>
          <a href="#">Devices</a>
        </nav>
      </div>
      <div class="flex items-center mt-3 gap-4">
        <div class="user flex items-center gap-2 border-[#F2F4F714] border bg-[#002956]  px-3 py-1 rounded-full">
          <span class="w-8 h-8 rounded-full bg-gray-300 border-2 border-white">
            <img :src="Images.avatar" alt="avatar" class="w-full h-full object-cover rounded-full" />
          </span>
          <span class="text-white">temitope@newglobe.com</span>
          <LogOut @click="handleLogout" class="ml-4 cursor-pointer text-[#27CD93] hover:text-[#18916b]" :size="22" />
        </div>
        <span> </span>
      </div>
    </div>
    <div class="mt-[110px] flex items-center justify-between px-10">
       <div class="">
          <h1 class="text-[#F2F4F7] font-[600] text-[26px] mb-1 flex items-center">Hello Temitope <img :src="Images.wave" class="ml-2" alt="waves"/></h1>
          <p class="text-md text-[#EAEAEA] font-normal">Here is a breakdown of your data, today!</p>
       </div>
       <div class="">
           <Dropdown trigger="click">
              <button class="bg-[#27CD93]  hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2">
                <PlusOutlined />
                Add New
                <DownOutlined />
              </button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">New School</a-menu-item>
                  <a-menu-item key="2">New Device</a-menu-item>
                  <a-menu-item key="3">New Battery Report</a-menu-item>
                </a-menu>
              </template>
            </Dropdown>
       </div>
    </div>
  </div>
</template>


