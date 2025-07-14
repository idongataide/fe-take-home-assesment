import { describe, it, expect } from 'vitest';
import type { BatteryReading } from './batteryService';
import { getSchoolBatteryReports, groupBy, calculateDeviceHealth } from './batteryService';

// Mock data for I used for testing
const readings: BatteryReading[] = [
  { serialNumber: 'A', batteryLevel: 100, timestamp: '2024-07-01T00:00:00Z', academyId: 1, employeeId: 'E1' },
  { serialNumber: 'A', batteryLevel: 80, timestamp: '2024-07-01T12:00:00Z', academyId: 1, employeeId: 'E1' },
  { serialNumber: 'A', batteryLevel: 60, timestamp: '2024-07-02T00:00:00Z', academyId: 1, employeeId: 'E1' },
  { serialNumber: 'B', batteryLevel: 90, timestamp: '2024-07-01T00:00:00Z', academyId: 1, employeeId: 'E2' },
  { serialNumber: 'B', batteryLevel: 85, timestamp: '2024-07-01T12:00:00Z', academyId: 1, employeeId: 'E2' },
];

describe('groupBy', () => {
  it('groups items by a key', () => {
    const grouped = groupBy(readings, r => r.serialNumber);
    expect(Object.keys(grouped)).toContain('A');
    expect(Object.keys(grouped)).toContain('B');
    expect(grouped['A'].length).toBe(3);
    expect(grouped['B'].length).toBe(2);
  });
});

describe('calculateDeviceHealth', () => {
  it('returns nulls for insufficient readings', () => {
    const result = calculateDeviceHealth([readings[0]]);
    expect(result.averageDailyUsage).toBeNull();
    expect(result.unhealthy).toBeNull();
  });

  it('calculates average daily usage and unhealthy status', () => {
    const result = calculateDeviceHealth(readings.filter(r => r.serialNumber === 'A'));
    expect(result.averageDailyUsage).toBeGreaterThan(0);
    expect(typeof result.unhealthy).toBe('boolean');
  });

  it('skips increases in battery level (charging events)', () => {
    const testReadings = [
      { serialNumber: 'C', batteryLevel: 80, timestamp: '2024-07-01T00:00:00Z', academyId: 1, employeeId: 'E3' },
      { serialNumber: 'C', batteryLevel: 90, timestamp: '2024-07-01T01:00:00Z', academyId: 1, employeeId: 'E3' }, 
      { serialNumber: 'C', batteryLevel: 70, timestamp: '2024-07-01T02:00:00Z', academyId: 1, employeeId: 'E3' },
    ];
    const result = calculateDeviceHealth(testReadings);
    expect(result.averageDailyUsage).toBeGreaterThan(0);
  });
});

describe('getSchoolBatteryReports', () => {
  it('returns an array of SchoolBatteryReport', () => {
    const reports = getSchoolBatteryReports();
    expect(Array.isArray(reports)).toBe(true);
    expect(reports.length).toBeGreaterThan(0);
    for (const report of reports) {
      expect(typeof report.academyId).toBe('number');
      expect(Array.isArray(report.healthyDevices)).toBe(true);
      expect(Array.isArray(report.unhealthyDevices)).toBe(true);
    }
  });

  it('sorts reports by number of unhealthy devices descending', () => {
    const reports = getSchoolBatteryReports();
    for (let i = 1; i < reports.length; i++) {
      expect(reports[i - 1].unhealthyDevices.length).toBeGreaterThanOrEqual(reports[i].unhealthyDevices.length);
    }
  });
}); 