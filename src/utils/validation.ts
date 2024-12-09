export interface ValidationRule {
  min: number;
  max: number;
  required?: boolean;
}

export const MODEL_VALIDATION_RULES: Record<string, ValidationRule> = {
  // Completion settings validations
  n_predict: {min: 1, max: 4096, required: true},
  temperature: {min: 0, max: 1, required: true},
  top_k: {min: 1, max: 128, required: true},
  top_p: {min: 0, max: 1, required: true},
  min_p: {min: 0, max: 1, required: true},
  xtc_threshold: {min: 0, max: 1, required: true},
  xtc_probability: {min: 0, max: 1, required: true},
  typical_p: {min: 0, max: 2, required: true},
  penalty_last_n: {min: 0, max: 256, required: true},
  penalty_repeat: {min: 0, max: 2, required: true},
  penalty_freq: {min: 0, max: 2, required: true},
  penalty_present: {min: 0, max: 2, required: true},
  mirostat_tau: {min: 0, max: 10, required: true},
  mirostat_eta: {min: 0, max: 1, required: true},
  seed: {min: 0, max: Number.MAX_SAFE_INTEGER, required: true},
  n_probs: {min: 0, max: 100, required: true},
};

export const validateNumericField = (
  value: string | number,
  rule: ValidationRule,
): boolean => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  if (
    rule.required &&
    (value === undefined || value === null || value === '')
  ) {
    return false;
  }
  if (isNaN(numValue)) {
    return !rule.required;
  }
  return numValue >= rule.min && numValue <= rule.max;
};

export const validateCompletionSettings = (
  settings: Record<string, any>,
): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  Object.entries(MODEL_VALIDATION_RULES).forEach(([key, rule]) => {
    if (key in settings && !validateNumericField(settings[key], rule)) {
      errors[key] = `Value must be between ${rule.min} and ${rule.max}`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
