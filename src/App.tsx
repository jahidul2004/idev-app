/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#e6a520';
const BG_COLOR = '#0F172A';
const CARD_BG = '#1E293B';

type DevInfo = {
  device: {
    deviceName?: string;
    brand?: string;
    manufacturer?: string;
    model?: string;
    deviceType?: string;
    uniqueId?: string;
  };
  system: {
    systemName?: string;
    systemVersion?: string;
    baseOs?: string;
    apiLevel?: number;
    buildNumber?: string;
  };
  battery: {
    batteryLevel?: number;
    charging?: boolean;
  };
  memory: {
    totalMemory?: number;
    usedMemory?: number;
  };
  storage: {
    totalDisk?: number;
    freeDisk?: number;
  };
  network: {
    ipAddress?: string;
    carrier?: string;
  };
  hardware: {
    supportedAbis?: string[];
    isCameraPresent?: boolean;
  };
  deviceState: {
    isEmulator?: boolean;
    isTablet?: boolean;
  };
};

export default function App() {
  const [devInfo, setDevInfo] = useState<DevInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === -1) return 'N/A';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const formatBattery = (level?: number) => {
    if (level === undefined || level === -1) return 'N/A';
    return `${Math.round(level * 100)}%`;
  };

  const fetchDeviceInfo = async () => {
    try {
      const [
        deviceName,
        brand,
        manufacturer,
        model,
        deviceType,
        uniqueId,
        systemName,
        systemVersion,
        baseOs,
        apiLevel,
        buildNumber,
        batteryLevel,
        charging,
        totalMemory,
        usedMemory,
        totalDisk,
        freeDisk,
        ipAddress,
        carrier,
        supportedAbis,
        isEmulator,
        isTablet,
        isCameraPresent,
      ] = await Promise.all([
        DeviceInfo.getDeviceName(),
        DeviceInfo.getBrand(),
        DeviceInfo.getManufacturer(),
        DeviceInfo.getModel(),
        DeviceInfo.getDeviceType(),
        DeviceInfo.getUniqueId(),
        DeviceInfo.getSystemName(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getBaseOs(),
        DeviceInfo.getApiLevel(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getBatteryLevel(),
        DeviceInfo.isBatteryCharging(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.getUsedMemory(),
        DeviceInfo.getTotalDiskCapacity(),
        DeviceInfo.getFreeDiskStorage(),
        DeviceInfo.getIpAddress(),
        DeviceInfo.getCarrier(),
        DeviceInfo.supportedAbis(),
        DeviceInfo.isEmulator(),
        DeviceInfo.isTablet(),
        DeviceInfo.isCameraPresent(),
      ]);

      const info: DevInfo = {
        device: {
          deviceName,
          brand,
          manufacturer,
          model,
          deviceType,
          uniqueId,
        },
        system: { systemName, systemVersion, baseOs, apiLevel, buildNumber },
        battery: { batteryLevel, charging },
        memory: { totalMemory, usedMemory },
        storage: { totalDisk, freeDisk },
        network: { ipAddress, carrier },
        hardware: { supportedAbis, isCameraPresent },
        deviceState: { isEmulator, isTablet },
      };

      setDevInfo(info);
    } catch (err) {
      setError('Failed to fetch device info!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceInfo();
  }, []);

  const InfoRow = ({
    label,
    value,
    isLast,
  }: {
    label: string;
    value: any;
    isLast?: boolean;
  }) => (
    <View style={[styles.row, isLast && { borderBottomWidth: 0 }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value?.toString() || 'N/A'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: BG_COLOR }]}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading System...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />

      {/* Professional Header Section */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.greeting}>i Dev</Text>
          <Text style={styles.modelText}>
            {devInfo?.device.brand} {devInfo?.device.model}
          </Text>
        </View>
        <View style={styles.batteryBadge}>
          <Text style={styles.batteryText}>
            {formatBattery(devInfo?.battery.batteryLevel)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stat Boxes */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>RAM</Text>
            <Text style={styles.statValue}>
              {formatBytes(devInfo?.memory.totalMemory).split(' ')[0]}G
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>OS</Text>
            <Text style={styles.statValue}>
              v{devInfo?.system.systemVersion}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>API</Text>
            <Text style={styles.statValue}>{devInfo?.system.apiLevel}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Identity</Text>
          <InfoRow label="Device Name" value={devInfo?.device.deviceName} />
          <InfoRow label="Manufacturer" value={devInfo?.device.manufacturer} />
          <InfoRow
            label="Hardware"
            value={devInfo?.hardware.supportedAbis?.[0]}
          />
          <InfoRow label="Unique ID" value={devInfo?.device.uniqueId} isLast />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System & Network</Text>
          <InfoRow label="System Name" value={devInfo?.system.systemName} />
          <InfoRow label="IP Address" value={devInfo?.network.ipAddress} />
          <InfoRow label="Carrier" value={devInfo?.network.carrier} />
          <InfoRow
            label="Build Number"
            value={devInfo?.system.buildNumber}
            isLast
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Storage Details</Text>
          <InfoRow
            label="Total Storage"
            value={formatBytes(devInfo?.storage.totalDisk)}
          />
          <InfoRow
            label="Free Storage"
            value={formatBytes(devInfo?.storage.freeDisk)}
          />
          <InfoRow
            label="Used RAM"
            value={formatBytes(devInfo?.memory.usedMemory)}
            isLast
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Others</Text>
          <InfoRow
            label="Is Tablet"
            value={devInfo?.deviceState.isTablet ? 'Yes' : 'No'}
          />
          <InfoRow
            label="Camera"
            value={devInfo?.hardware.isCameraPresent ? 'Present' : 'Missing'}
          />
          <InfoRow
            label="Emulator"
            value={devInfo?.deviceState.isEmulator ? 'Yes' : 'No'}
            isLast
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#94A3B8',
    letterSpacing: 1.5,
    fontSize: 12,
    fontWeight: '700',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 25,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 1,
  },
  modelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  batteryBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  batteryText: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: (width - 60) / 3,
    backgroundColor: CARD_BG,
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 5,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  label: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
});
