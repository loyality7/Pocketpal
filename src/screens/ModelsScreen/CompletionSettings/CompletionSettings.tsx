import {View} from 'react-native';
import React, {useState, useEffect} from 'react';

import Slider from '@react-native-community/slider';
import {CompletionParams} from '@pocketpalai/llama.rn';
import {Text, Switch, Chip, SegmentedButtons} from 'react-native-paper';

import {TextInput} from '../../../components';

import {useTheme} from '../../../hooks';

import {createStyles} from './styles';

import {
  MODEL_VALIDATION_RULES,
  validateNumericField,
} from '../../../utils/validation';

interface Props {
  settings: CompletionParams;
  onChange: (name: string, value: any) => void;
}

const PARAMETER_DESCRIPTIONS = {
  n_predict: 'Maximum number of tokens to generate',
  temperature: 'Controls randomness (higher = more creative)',
  top_k: 'Limits token selection to K most likely options',
  top_p: 'Cumulative probability threshold for token selection',
  min_p: 'Minimum token probability relative to best token',
  xtc_threshold: 'Minimum probability for token consideration',
  xtc_probability: 'Probability of token removal at start',
  typical_p: 'Controls locally typical sampling',
  penalty_last_n: 'Number of tokens to check for repetition',
  penalty_repeat: 'Penalizes token sequence repetition',
  penalty_freq: 'Penalizes frequent token usage',
  penalty_present: 'Penalizes token presence in context',
  mirostat: 'Advanced sampling mode for stable output',
  mirostat_tau: 'Target complexity for Mirostat',
  mirostat_eta: 'Learning rate for Mirostat',
  penalize_nl: 'Apply repeat penalty to newlines',
  seed: 'Random seed for reproducible output',
  n_probs: 'Return top token probabilities',
  stop: 'Sequences that end generation',
};

export const CompletionSettings: React.FC<Props> = ({settings, onChange}) => {
  const [localSliderValues, setLocalSliderValues] = useState({});
  const [newStopWord, setNewStopWord] = useState('');
  const theme = useTheme();
  const styles = createStyles(theme);

  // Reset local values when settings change
  useEffect(() => {
    setLocalSliderValues({});
  }, [settings]);

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
      <Text style={styles.description}>{PARAMETER_DESCRIPTIONS[name]}</Text>
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
    label,
  }: {
    name: string;
    label?: string;
  }) => {
    const rule = MODEL_VALIDATION_RULES[name];
    if (!rule) {
      console.warn(`No validation rule found for ${name}`);
      return null;
    }

    const value = settings[name].toString();
    const isValid = validateNumericField(value, rule);

    return (
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>{label ?? name}</Text>
        <Text style={styles.description}>{PARAMETER_DESCRIPTIONS[name]}</Text>
        <TextInput
          value={value}
          onChangeText={_value => {
            onChange(name, _value);
          }}
          keyboardType="numeric"
          error={!isValid}
          helperText={
            !isValid
              ? `Value must be between ${rule.min} and ${rule.max}`
              : undefined
          }
          testID={`${name}-input`}
        />
      </View>
    );
  };

  const renderSwitch = (name: string, label?: string) => (
    <View style={[styles.settingItem, styles.row]}>
      <View>
        <Text style={styles.settingLabel}>{label ?? name}</Text>
        <Text style={styles.description}>{PARAMETER_DESCRIPTIONS[name]}</Text>
      </View>
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

  const renderMirostatSelector = () => (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>Mirostat</Text>
      <Text style={styles.description}>{PARAMETER_DESCRIPTIONS.mirostat}</Text>
      <SegmentedButtons
        value={(settings.mirostat ?? 0).toString()}
        onValueChange={value => onChange('mirostat', parseInt(value, 10))}
        density="high"
        buttons={[
          {
            value: '0',
            label: 'Off',
          },
          {
            value: '1',
            label: 'v1',
          },
          {
            value: '2',
            label: 'v2',
          },
        ]}
        style={styles.segmentedButtons}
      />
    </View>
  );

  return (
    <View>
      {renderIntegerInput({
        name: 'n_predict',
        label: 'N-Predict',
      })}
      {renderSlider({
        name: 'temperature',
        min: MODEL_VALIDATION_RULES.temperature.min,
        max: MODEL_VALIDATION_RULES.temperature.max,
        label: 'Temperature',
      })}
      {renderSlider({
        name: 'top_k',
        min: MODEL_VALIDATION_RULES.top_k.min,
        max: MODEL_VALIDATION_RULES.top_k.max,
        step: 1,
        label: 'Top-K',
      })}
      {renderSlider({
        name: 'top_p',
        min: MODEL_VALIDATION_RULES.top_p.min,
        max: MODEL_VALIDATION_RULES.top_p.max,
        label: 'Top-P',
      })}
      {renderSlider({
        name: 'min_p',
        min: MODEL_VALIDATION_RULES.min_p.min,
        max: MODEL_VALIDATION_RULES.min_p.max,
        label: 'Min-P',
      })}
      {renderSlider({
        name: 'xtc_threshold',
        min: MODEL_VALIDATION_RULES.xtc_threshold.min,
        max: MODEL_VALIDATION_RULES.xtc_threshold.max,
        label: 'XTC Threshold',
      })}
      {renderSlider({
        name: 'xtc_probability',
        min: MODEL_VALIDATION_RULES.xtc_probability.min,
        max: MODEL_VALIDATION_RULES.xtc_probability.max,
        label: 'XTC Probability',
      })}
      {renderSlider({
        name: 'typical_p',
        min: MODEL_VALIDATION_RULES.typical_p.min,
        max: MODEL_VALIDATION_RULES.typical_p.max,
        label: 'Typical P',
      })}
      {renderSlider({
        name: 'penalty_last_n',
        min: MODEL_VALIDATION_RULES.penalty_last_n.min,
        max: MODEL_VALIDATION_RULES.penalty_last_n.max,
        step: 1,
        label: 'Penalty Last N',
      })}
      {renderSlider({
        name: 'penalty_repeat',
        min: MODEL_VALIDATION_RULES.penalty_repeat.min,
        max: MODEL_VALIDATION_RULES.penalty_repeat.max,
        label: 'Penalty Repeat',
      })}
      {renderSlider({
        name: 'penalty_freq',
        min: MODEL_VALIDATION_RULES.penalty_freq.min,
        max: MODEL_VALIDATION_RULES.penalty_freq.max,
        label: 'Penalty Freq',
      })}
      {renderSlider({
        name: 'penalty_present',
        min: MODEL_VALIDATION_RULES.penalty_present.min,
        max: MODEL_VALIDATION_RULES.penalty_present.max,
        label: 'Penalty Present',
      })}
      {renderMirostatSelector()}
      {(settings.mirostat ?? 0) > 0 && (
        <>
          {renderSlider({
            name: 'mirostat_tau',
            min: MODEL_VALIDATION_RULES.mirostat_tau.min,
            max: MODEL_VALIDATION_RULES.mirostat_tau.max,
            step: 1,
            label: 'Mirostat Tau',
          })}
          {renderSlider({
            name: 'mirostat_eta',
            min: MODEL_VALIDATION_RULES.mirostat_eta.min,
            max: MODEL_VALIDATION_RULES.mirostat_eta.max,
            label: 'Mirostat Eta',
          })}
        </>
      )}
      {renderSwitch('penalize_nl', 'Penalize NL')}
      {renderIntegerInput({
        name: 'seed',
        label: 'Seed',
      })}
      {renderIntegerInput({
        name: 'n_probs',
        label: 'N-Probs',
      })}
      {renderStopWords()}
    </View>
  );
};
