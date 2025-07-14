<template>
  <div class="home ">
    <div v-if="reports.length === 0">Loading...</div>
    <div v-else class="pb-20">
      <TopBar />
        <div class="border bg-[#fff] border-[#F2F4F7] w-full md:w-[85%] mt-[-80px] mx-auto p-3 rounded-3xl"
          style="box-shadow: 0px 2px 32px 0px #00000024;"
        >
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(item, index) in stats"
                :key="index"
                class="border border-[#EAEAEA] rounded-2xl flex flex-col p-5"
              >
                <span
                  class="rounded-full w-10 h-10 ml-auto p-2 mb-2 flex items-center justify-center"
                  :style="{ backgroundColor: item.bgColor }"
                >
                  <img :src="item.icon" alt="icon" class="w-[20px]"/>
                </span>
                <div class="">
                  <h1 class="text-[#013E20] text-[36px] mb-0 font-semibold">{{ item.count }}</h1>
                  <span class="text-[#475467] text-md font-normal">{{ item.label }}</span>
                </div>
              </div>
            </div>

         </div>
        <div class="flex item-center justify-center mt-10 gap-8 md:w-[85%] mx-auto">
          <BatteryTable :reports="reports" class="w-2/3" />
          <BatteryPieChart :reports="reports" class="w-1/3" />
        </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import type { SchoolBatteryReport } from '../services/batteryService';
import  { getSchoolBatteryReports } from '../services/batteryService';
import TopBar from '../components/TopBar.vue';
import BatteryTable from '../components/BatteryTable.vue';
import BatteryPieChart from '../components/BatteryPieChart.vue';
import Images from '@/components/Images';

const reports = ref<SchoolBatteryReport[]>([]);

const stats = computed(() => [
  {
    count: reports.value.length, 
    icon: Images.icon.icon1,
    label: 'All Academies',
    bgColor: '#592CB21F',
  },
  {
    count: reports.value.reduce((sum, r) => sum + r.healthyDevices.length + r.unhealthyDevices.length, 0), 
    icon: Images.icon.icon2,
    label: 'Distributed Devices',
    bgColor: '#27CC931F',
  },
  {
    count: reports.value.reduce((sum, r) => sum + r.healthyDevices.length, 0), 
    icon: Images.icon.icon3,
    label: 'Good Batteries',
    bgColor: '#468ED71F',
  },
  {
    count: reports.value.reduce((sum, r) => sum + r.unhealthyDevices.length, 0),
    icon: Images.icon.icon4,
    label: 'Critical Batteries',
    bgColor: '#F9E2E2',
  },
]);


onMounted(() => {
  reports.value = getSchoolBatteryReports();
});
</script>



