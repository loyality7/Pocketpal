import {View} from 'react-native';
import React, {useState} from 'react';

import Slider from '@react-native-community/slider';
import {CompletionParams} from '@pocketpalai/llama.rn';
import {Text, Switch, Divider, Chip} from 'react-native-paper';

import {TextInput} from '../../../components';

import {useTheme} from '../../../hooks';

import {createStyles} from './styles';

interface Props {
  settings: CompletionParams;
  onChange: (name: string, value: any) => void;
}

export const CompletionSettings: React.FC<Props> = ({settings, onChange}) => {
  const [localSliderValues, setLocalSliderValues] = useState({});
  const [newStopWord, setNewStopWord] = useState('');
  const theme = useTheme();
  const styles = createStyles();

  const handleOnChange = (name, value) => {
    onChange(name, value);
  };

  const renderSlider = ({
    name,
    min,
    max,
    step = 0.01,
    label,
  }: {
    name: string;
    min: number;
    max: number;
    step?: number;
    label?: string;
  }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{label ?? name}</Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={localSliderValues[name] ?? settings[name]}
        onValueChange={value => {
          setLocalSliderValues(prev => ({...prev, [name]: value}));
        }}
        onSlidingComplete={value => {
          handleOnChange(name, value);
        }}
        thumbTintColor={theme.colors.primary}
        minimumTrackTintColor={theme.colors.primary}
        //onValueChange={value => onChange(name, value)}
        testID={`${name}-slider`}
      />
      <Text style={styles.settingValue}>
        {Number.isInteger(step)
          ? Math.round(localSliderValues[name] ?? settings[name]).toString()
          : (localSliderValues[name] ?? settings[name]).toFixed(2)}
      </Text>
    </View>
  );

  const renderIntegerInput = ({
    name,
    min,
    max,
    label,
  }: {
    name: string;
    min: number;
    max: number;
    label?: string;
  }) => (
    <View style={styles.settingItem}>
      <TextInput
        value={settings[name].toString()}
        label={label ?? name}
        onChangeText={value => {
          const intValue = parseInt(value, 10);
          if (!isNaN(intValue)) {
            onChange(name, Math.max(min, Math.min(max, intValue)));
          }
        }}
        keyboardType="numeric"
        /*left={<TextInput.Affix text={name} textStyle={styles.inputLabel} />}*/
        testID={`${name}-input`}
      />
    </View>
  );

  const renderSwitch = (name: string) => (
    <View style={[styles.settingItem, styles.row]}>
      <Text style={styles.settingLabel}>{name}</Text>
      <Switch
        value={settings[name]}
        onValueChange={value => onChange(name, value)}
        testID={`${name}-switch`}
      />
    </View>
  );

  const renderStopWords = () => (
    <View style={styles.settingItem}>
      <View style={styles.stopLabel}>
        <Text style={styles.settingLabel}>stop</Text>
      </View>

      {/* Display existing stop words as chips */}
      <View style={styles.stopWordsContainer}>
        {(settings.stop ?? []).map((word, index) => (
          <Chip
            key={index}
            onClose={() => {
              const newStops = (settings.stop ?? []).filter(
                (_, i) => i !== index,
              );
              onChange('stop', newStops);
            }}
            compact
            textStyle={styles.stopChipText}
            style={styles.stopChip}>
            {word}
          </Chip>
        ))}
      </View>

      {/* Input for new stop words */}
      <TextInput
        value={newStopWord}
        placeholder="Add new stop word"
        onChangeText={setNewStopWord}
        onSubmitEditing={() => {
          if (newStopWord.trim()) {
            onChange('stop', [...(settings.stop ?? []), newStopWord.trim()]);
            setNewStopWord('');
          }
        }}
        testID="stop-input"
      />
    </View>
  );

  return (
    <View>
      {renderIntegerInput({
        name: 'n_predict',
        min: 0,
        max: 2048,
        label: 'N-Predict',
      })}
      {renderSlider({
        name: 'temperature',
        min: 0,
        max: 1,
        label: 'Temperature',
      })}
      {renderSlider({name: 'top_k', min: 1, max: 128, step: 1, label: 'Top-K'})}
      {renderSlider({name: 'top_p', min: 0, max: 1, label: 'Top-P'})}
      {renderSlider({name: 'min_p', min: 0, max: 1, label: 'Min-P'})}
      {renderSlider({
        name: 'xtc_threshold',
        min: 0,
        max: 1,
        label: 'XTC Threshold',
      })}
      {renderSlider({
        name: 'xtc_probability',
        min: 0,
        max: 1,
        label: 'XTC Probability',
      })}
      {renderSlider({name: 'typical_p', min: 0, max: 2, label: 'Typical P'})}
      {renderSlider({name: 'penalty_last_n', min: 0, max: 256, step: 1})}
      {renderSlider({name: 'penalty_repeat', min: 0, max: 2})}
      {renderSlider({name: 'penalty_freq', min: 0, max: 2})}
      {renderSlider({name: 'penalty_present', min: 0, max: 2})}
      <Divider style={styles.divider} />
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>mirostat</Text>
        <View style={styles.chipContainer}>
          {[0, 1, 2].map(value => (
            <Chip
              key={value}
              selected={settings.mirostat === value}
              onPress={() => onChange('mirostat', value)}
              style={styles.chip}>
              {value.toString()}
            </Chip>
          ))}
        </View>
      </View>
      {renderSlider({
        name: 'mirostat_tau',
        min: 0,
        max: 10,
        step: 1,
        label: 'Mirostat Tau',
      })}
      {renderSlider({
        name: 'mirostat_eta',
        min: 0,
        max: 1,
        label: 'Mirostat Eta',
      })}
      {renderSwitch('penalize_nl')}
      {renderIntegerInput({
        name: 'seed',
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        label: 'Seed',
      })}
      {renderIntegerInput({
        name: 'n_probs',
        min: 0,
        max: 100,
        label: 'N-Probs',
      })}
      {renderStopWords()}
    </View>
  );
};
