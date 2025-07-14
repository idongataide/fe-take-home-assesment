<template>
  <div class="battery-pie-chart bg-[#F2F4F7] border border-[#F2F4F7] rounded-lg p-2">
    <div class="flex justify-between items-center mb-2">
      <span class="font-[500] text-[#344054]">Battery Health Chart</span>
      <Dropdown trigger="click">
        <button class="border rounded px-2 py-1 flex items-center gap-2 bg-white">
          {{ selectedAcademyLabel }}
          <DownOutlined style="font-size: 12px;" />
        </button>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item v-for="r in reports" :key="r.academyId" :value="r.academyId">
              {{ r.academyId }}
            </a-menu-item>
          </a-menu>
        </template>
      </Dropdown>
    </div>
    <div v-if="selectedReport">
        <div class="bg-[#fff] rounded-lg pt-2 pb-7">
            <v-chart :option="chartOption" autoresize style="height: 305px;" />
        </div>
    </div>
    <div v-else class="text-gray-400">No data</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import type { SchoolBatteryReport } from '../services/batteryService';
import VChart from 'vue-echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { use } from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';

use([CanvasRenderer, TooltipComponent, LegendComponent, PieChart]);

const props = defineProps<{ reports: SchoolBatteryReport[] }>();
const selectedAcademyId = ref(props.reports[0]?.academyId || null);

watch(() => props.reports, (newVal) => {
  if (newVal.length > 0 && !selectedAcademyId.value) {
    selectedAcademyId.value = newVal[0].academyId;
  }
});

const selectedReport = computed(() =>
  props.reports.find(r => r.academyId === selectedAcademyId.value)
);

const selectedAcademyLabel = computed(() => {
  const found = props.reports.find(r => r.academyId === selectedAcademyId.value);
  return found ? found.academyId : 'Select Academy';
});

function handleMenuClick({ key }: { key: string }) {
  selectedAcademyId.value = parseInt(key, 10);
}

const chartOption = computed(() => {
  if (!selectedReport.value) return {};
  const good = selectedReport.value.healthyDevices.length;
  const critical = selectedReport.value.unhealthyDevices.length;
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: -5 },
    series: [
      {
        name: 'Battery Health',
        type: 'pie',
        radius: '70%',
        data: [
          { value: good, name: 'No. of Good device batteries' },
          { value: critical, name: 'No. of critical device batteries' },
        ],
        label: {
          formatter: '{b}: {d}%'
        },
        color: ['#27CD93', '#DA2A2A']
      }
    ]
  };
});
</script> 