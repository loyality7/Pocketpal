import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import {Platform, NativeModules} from 'react-native';

import {useTheme} from '../../hooks';
import {createStyles} from './styles';

const {DeviceInfoModule} = NativeModules;

const getChipsetInfo = async () => {
  if (Platform.OS !== 'android' || !DeviceInfoModule) {
    return '';
  }
  try {
    return await DeviceInfoModule.getChipset();
  } catch (e) {
    console.warn('Failed to get chipset info:', e);
    return '';
  }
};

const getCPUInfo = async () => {
  if (!DeviceInfoModule) {
    console.warn('DeviceInfoModule not available');
    return {
      cores: 0,
      processors: [],
      features: [],
      socModel: '',
      hasFp16: false,
      hasDotProd: false,
      hasSve: false,
      hasI8mm: false,
    };
  }
  try {
    const info = await DeviceInfoModule.getCPUInfo();
    console.log('CPU Info received:', info);
    if (!info) {
      return null;
    }

    return Platform.OS === 'ios'
      ? {
          cores: info.cores || 0,
          processors: [],
          features: [],
          socModel: '',
          hasFp16: false,
          hasDotProd: false,
          hasSve: false,
          hasI8mm: false,
        }
      : info;
  } catch (e) {
    console.warn('Failed to get CPU info:', e);
    return null;
  }
};

const checkCpuFeatures = (features: string[]) => {
  return {
    hasFp16: features.some(f => ['fphp', 'fp16'].includes(f)),
    hasDotProd: features.some(f => ['dotprod', 'asimddp'].includes(f)),
    hasSve: features.some(f => f === 'sve'),
    hasI8mm: features.some(f => f === 'i8mm'),
  };
};

export const DeviceInfoCard = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [deviceInfo, setDeviceInfo] = useState({
    model: DeviceInfo.getModel(),
    systemName: Platform.OS === 'ios' ? 'iOS' : 'Android',
    systemVersion: Platform.Version.toString(),
    brand: DeviceInfo.getBrand(),
    cpuArch: [] as string[],
    isEmulator: false,
    version: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    device: '',
    deviceId: '',
    totalMemory: 0,
    chipset: '',
    cpu: '',
    cpuDetails: {
      cores: 0,
      processors: [] as Array<{
        processor: string;
        'model name': string;
        'cpu MHz': string;
        vendor_id: string;
      }>,
      socModel: '',
      features: [] as string[],
      hasFp16: false,
      hasDotProd: false,
      hasSve: false,
      hasI8mm: false,
    },
  });

  useEffect(() => {
    Promise.all([
      DeviceInfo.supportedAbis(),
      DeviceInfo.isEmulator(),
      DeviceInfo.getDevice(),
      DeviceInfo.getDeviceId(),
      DeviceInfo.getTotalMemory(),
      getChipsetInfo(),
      getCPUInfo(),
    ]).then(
      ([abis, emulator, device, deviceId, totalMem, chipset, cpuInfo]) => {
        console.log('cpuInfo', cpuInfo);
        if (typeof cpuInfo === 'object' && Array.isArray(cpuInfo.features)) {
          // Double-check features on JS side
          const jsFeatures = checkCpuFeatures(cpuInfo.features);
          console.log('JS-side feature check:', jsFeatures);
          // Compare with native results
          console.log(
            'Native-side matches JS:',
            jsFeatures.hasFp16 === cpuInfo.hasFp16 &&
              jsFeatures.hasDotProd === cpuInfo.hasDotProd &&
              jsFeatures.hasSve === cpuInfo.hasSve &&
              jsFeatures.hasI8mm === cpuInfo.hasI8mm,
          );
        }

        setDeviceInfo(prev => ({
          ...prev,
          cpuArch: abis,
          isEmulator: emulator,
          device,
          deviceId,
          totalMemory: totalMem,
          chipset,
          //cpu,
          cpuDetails:
            typeof cpuInfo === 'object'
              ? cpuInfo
              : {
                  cores: 0,
                  processors: [],
                  socModel: '',
                  features: [],
                  hasFp16: false,
                  hasDotProd: false,
                  hasSve: false,
                  hasI8mm: false,
                },
        }));
      },
    );
  }, []);

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <Card elevation={0} style={styles.deviceInfoCard}>
      <Card.Content>
        <View style={styles.deviceInfoRow}>
          <Text variant="labelSmall" style={styles.deviceInfoLabel}>
            Device
          </Text>
          <Text variant="bodySmall" style={styles.deviceInfoValue}>
            {deviceInfo.brand} {deviceInfo.model}
          </Text>
        </View>
        <View style={styles.deviceInfoRow}>
          <Text variant="labelSmall" style={styles.deviceInfoLabel}>
            OS
          </Text>
          <Text variant="bodySmall" style={styles.deviceInfoValue}>
            {deviceInfo.systemName} {deviceInfo.systemVersion}
          </Text>
        </View>
        <View style={styles.deviceInfoRow}>
          <Text variant="labelSmall" style={styles.deviceInfoLabel}>
            Emulator
          </Text>
          <Text variant="bodySmall" style={styles.deviceInfoValue}>
            {deviceInfo.isEmulator ? 'Yes' : 'No'}
          </Text>
        </View>
        <View style={styles.deviceInfoRow}>
          <Text variant="labelSmall" style={styles.deviceInfoLabel}>
            Architecture
          </Text>
          <Text variant="bodySmall" style={styles.deviceInfoValue}>
            {Array.isArray(deviceInfo.cpuArch)
              ? deviceInfo.cpuArch.join(', ')
              : deviceInfo.cpuArch}
          </Text>
        </View>
        {Platform.OS === 'android' && deviceInfo.chipset && (
          <View style={styles.deviceInfoRow}>
            <Text variant="labelSmall" style={styles.deviceInfoLabel}>
              Chipset
            </Text>
            <Text variant="bodySmall" style={styles.deviceInfoValue}>
              {deviceInfo.chipset}
            </Text>
          </View>
        )}
        {Platform.OS === 'android' && deviceInfo.cpu && (
          <View style={styles.deviceInfoRow}>
            <Text variant="labelSmall" style={styles.deviceInfoLabel}>
              CPU/SoC
            </Text>
            <Text variant="bodySmall" style={styles.deviceInfoValue}>
              {deviceInfo.cpu}
            </Text>
          </View>
        )}
        <View style={styles.deviceInfoRow}>
          <Text variant="labelSmall" style={styles.deviceInfoLabel}>
            App Version
          </Text>
          <Text variant="bodySmall" style={styles.deviceInfoValue}>
            {deviceInfo.version} ({deviceInfo.buildNumber})
          </Text>
        </View>
        <View style={styles.deviceInfoRow}>
          <Text variant="labelSmall" style={styles.deviceInfoLabel}>
            Device ID
          </Text>
          <Text variant="bodySmall" style={styles.deviceInfoValue}>
            {deviceInfo.device} ({deviceInfo.deviceId})
          </Text>
        </View>
        <View style={styles.deviceInfoRow}>
          <Text variant="labelSmall" style={styles.deviceInfoLabel}>
            Total Memory
          </Text>
          <Text variant="bodySmall" style={styles.deviceInfoValue}>
            {formatBytes(deviceInfo.totalMemory)}
          </Text>
        </View>
        <View style={styles.deviceInfoRow}>
          <Text variant="labelSmall" style={styles.deviceInfoLabel}>
            CPU Cores
          </Text>
          <Text variant="bodySmall" style={styles.deviceInfoValue}>
            {deviceInfo.cpuDetails.cores}
          </Text>
        </View>
        {deviceInfo.cpuDetails.processors[0]?.['model name'] && (
          <View style={styles.deviceInfoRow}>
            <Text variant="labelSmall" style={styles.deviceInfoLabel}>
              CPU Model
            </Text>
            <Text variant="bodySmall" style={styles.deviceInfoValue}>
              {deviceInfo.cpuDetails.processors[0]['model name']}
            </Text>
          </View>
        )}
        {deviceInfo.cpuDetails.socModel && (
          <View style={styles.deviceInfoRow}>
            <Text variant="labelSmall" style={styles.deviceInfoLabel}>
              SoC Model
            </Text>
            <Text variant="bodySmall" style={styles.deviceInfoValue}>
              {deviceInfo.cpuDetails.socModel}
            </Text>
          </View>
        )}
        {deviceInfo.cpuDetails.features.length > 0 && (
          <View style={styles.deviceInfoRow}>
            <Text variant="labelSmall" style={styles.deviceInfoLabel}>
              CPU Features
            </Text>
            <Text variant="bodySmall" style={styles.deviceInfoValue}>
              {deviceInfo.cpuDetails.features.join(', ')}
            </Text>
          </View>
        )}
        {Platform.OS === 'android' && (
          <View style={styles.deviceInfoRow}>
            <Text variant="labelSmall" style={styles.deviceInfoLabel}>
              ML Instructions
            </Text>
            <Text variant="bodySmall" style={styles.deviceInfoValue}>
              FP16: {deviceInfo.cpuDetails.hasFp16 ? '✓' : '✗'}, DotProd:{' '}
              {deviceInfo.cpuDetails.hasDotProd ? '✓' : '✗'}, SVE:{' '}
              {deviceInfo.cpuDetails.hasSve ? '✓' : '✗'}, I8MM:{' '}
              {deviceInfo.cpuDetails.hasI8mm ? '✓' : '✗'}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};
