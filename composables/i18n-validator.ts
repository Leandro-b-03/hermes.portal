import * as validators from '@vuelidate/validators';

export const useI18nValidators = () => {
  const { $i18n } = useNuxtApp();
  const { createI18nMessage } = validators
  const messagePath = ({ $validator }: { $validator: string }) => `setup.validations.${$validator}`;

  const withI18nMessage = createI18nMessage({ t: $i18n.t.bind($i18n), messagePath });

  const required = withI18nMessage(validators.required)
  const email = withI18nMessage(validators.email)
  const minLength = withI18nMessage(validators.minLength, { withArguments: true })
  const maxLength = withI18nMessage(validators.maxLength, { withArguments: true })
  const numeric = withI18nMessage(validators.numeric)
  const phone = withI18nMessage(validators.helpers.regex('phone', /^\(\d{2}\) \d{4}-\d{4}$/))
  const mobile = withI18nMessage(validators.helpers.regex('phone', /^\(\d{2}\) \d{4,5}-\d{4}$/))
  const sameAs = withI18nMessage(validators.sameAs)

  return {
    required,
    email,
    minLength,
    maxLength,
    numeric,
    phone,
    mobile,
    sameAs
  }
};