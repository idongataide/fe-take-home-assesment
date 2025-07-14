import batteryApiData from '../data/battery.json';

export interface BatteryReading {
  academyId: number;
  batteryLevel: number; 
  employeeId: string;
  serialNumber: string;
  timestamp: string;
}

export interface DeviceHealth {
  serialNumber: string;
  averageDailyUsage: number | null;
  unhealthy: boolean | null;
  readings: BatteryReading[];
}

export interface SchoolBatteryReport {
  academyId: number;
  unhealthyDevices: DeviceHealth[];
  healthyDevices: DeviceHealth[];
}

// Utility function to group array items by a key
export function groupBy<T, K extends keyof any>(arr: T[], key: (item: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

// this is used to calculate device health metrics from battery readings
export function calculateDeviceHealth(readings: BatteryReading[]): DeviceHealth {
  if (readings.length < 2) {
    return {
      serialNumber: readings[0]?.serialNumber || '',
      averageDailyUsage: null,
      unhealthy: null,
      readings,
    };
  }
  const sorted = [...readings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  let totalDrop = 0;
  let totalHours = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const prevLevel = prev.batteryLevel;
    const currLevel = curr.batteryLevel;
    const prevTime = new Date(prev.timestamp).getTime();
    const currTime = new Date(curr.timestamp).getTime();
    if (currLevel > prevLevel) continue; // this skips if the battery is charged
    const drop = prevLevel - currLevel;
    const hours = (currTime - prevTime) / (1000 * 60 * 60);
    if (hours <= 0) continue;
    totalDrop += drop;
    totalHours += hours;
  }
  if (totalHours === 0) {
    return {
      serialNumber: sorted[0].serialNumber,
      averageDailyUsage: null,
      unhealthy: null,
      readings: sorted,
    };
  }
  const avgDailyUsage = (totalDrop / totalHours) * 24 * 100; 
  return {
    serialNumber: sorted[0].serialNumber,
    averageDailyUsage: avgDailyUsage,
    unhealthy: avgDailyUsage > 30,
    readings: sorted,
  };
}

export function getSchoolBatteryReports() {
  const batteryData = batteryApiData;
  const byDevice = groupBy(batteryData, r => r.serialNumber);
  const deviceHealths: DeviceHealth[] = Object.values(byDevice).map(calculateDeviceHealth);
  const bySchool = groupBy(deviceHealths, d => {
    return d.readings[0]?.academyId || 0;
  });
  const reports: SchoolBatteryReport[] = Object.entries(bySchool).map(([academyId, devices]) => {
    const unhealthyDevices = devices.filter(d => d.unhealthy === true);
    const healthyDevices = devices.filter(d => d.unhealthy === false);
    return {
      academyId: Number(academyId),
      unhealthyDevices,
      healthyDevices,
    };
  });
  // I thenn Sorted by number of unhealthy devices (descending order)
  reports.sort((a, b) => b.unhealthyDevices.length - a.unhealthyDevices.length);
  return reports;
} 