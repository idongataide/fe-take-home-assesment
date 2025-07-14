<template>
  <a-table
    :columns="columns"
    :data-source="tableData"
    class="w-[100%]"
    row-key="academyId"
    bordered
    :pagination="false"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'sn'">
        {{ index + 1 }}
      </template>
      <template v-else-if="column.dataIndex === 'actions'">
        <a-button class="text-[#667085] flex items-center" type="link" @click="openModal(record)">View <ArrowRightOutlined class="text-xs font-medium" /> </a-button>
      </template>
      <template v-else>
        {{ record[column.dataIndex] }}
      </template>
    </template>
  </a-table>

  <!-- Modal -->
  <div v-if="modalVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg w-[90vw] max-w-2xl p-6 relative">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
          Device Details - {{ selectedAcademyName }} (ID: {{ selectedAcademyId }})
        </h2>
        <button @click="modalVisible = false" class="text-gray-500 hover:text-gray-700 text-2xl font-bold absolute right-4 top-4">&times;</button>
      </div>
      <div class="overflow-x-auto">
        <a-table
          :columns="modalColumns"
          :data-source="modalData"
          row-key="serialNumber"
          bordered
          :pagination="{ pageSize: 5 }"
          class="w-full"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'sn'">
              {{ index + 1 }}
            </template>
            <template v-else-if="column.dataIndex === 'employeeId'">
              {{ record.readings[0]?.employeeId || '' }}
            </template>
            <template v-else-if="column.dataIndex === 'initialBattery'">
              {{ (record.readings[0]?.batteryLevel * 100).toFixed(1) }}%
            </template>
            <template v-else-if="column.dataIndex === 'dailyDischarge'">
              <span v-if="record.averageDailyUsage !== null">{{ record.averageDailyUsage.toFixed(1) }}%</span>
              <span v-else>Unknown</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <span :class="record.unhealthy ? 'text-[#DA2A2A]' : 'text-green-600'">
                {{ record.unhealthy ? 'Critical' : 'Good' }}
              </span>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
import type { SchoolBatteryReport, DeviceHealth } from '../services/batteryService';
import { ArrowRightOutlined  }  from '@ant-design/icons-vue';
import 'ant-design-vue/dist/reset.css';

const props = defineProps<{ reports: SchoolBatteryReport[] }>();


//added random school names for better user experience
const academyNames: Record<number, string> = {
  30006: 'Kigali College',
  30007: 'Accra High',
  30013: 'Lagos City Academy',
  30015: 'Nairobi College',
  30017: 'Dakar Academy',
  30019: 'Abidjan College',
};

const columns = [
  { title: 'S/n', dataIndex: 'sn', key: 'sn' },
  { title: 'Academy Name', dataIndex: 'academyName', key: 'academyName' },
  { title: 'Academy ID', dataIndex: 'academyID', key: 'academyID' },
  { title: 'No. Of Devices', dataIndex: 'deviceCount', key: 'deviceCount' },
  { title: 'Good Batteries', dataIndex: 'goodBatteries', key: 'goodBatteries' },
  { title: 'Critical Batteries', dataIndex: 'criticalBatteries', key: 'criticalBatteries' },
  { title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

const tableData = computed(() =>
  props.reports.map((r, idx) => ({
    sn: idx + 1,
    academyName: academyNames[r.academyId] || r.academyId,
    academyID: r.academyId,
    deviceCount: r.healthyDevices.length + r.unhealthyDevices.length,
    goodBatteries: r.healthyDevices.length,
    criticalBatteries: r.unhealthyDevices.length,
    academyId: r.academyId,
    healthyDevices: r.healthyDevices,
    unhealthyDevices: r.unhealthyDevices,

    allDevices: [...r.healthyDevices, ...r.unhealthyDevices],
  }))
);

const modalVisible = ref(false);
const modalData = ref<DeviceHealth[]>([]);
const selectedAcademyName = ref<string>('');
const selectedAcademyId = ref<number | null>(null);

const modalColumns = [
  { title: 'S/n', dataIndex: 'sn', key: 'sn' },
  { title: 'Employee ID', dataIndex: 'employeeId', key: 'employeeId' },
  { title: 'Initial Battery', dataIndex: 'initialBattery', key: 'initialBattery' },
  { title: 'Daily Discharge', dataIndex: 'dailyDischarge', key: 'dailyDischarge' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const openModal = (record: any) => {
  modalData.value = record.allDevices.map((device: DeviceHealth) => ({
    ...device,
    employeeId: device.readings[0]?.employeeId || '',
  }));
  selectedAcademyName.value = record.academyName;
  selectedAcademyId.value = record.academyID;
  modalVisible.value = true;
};
</script> 