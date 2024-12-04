import type { Reactive } from "vue";

export function formatCurrency(value: any, monthly: boolean = false): string {
  if (value !== 0 && value !== '0.0')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value) + `${monthly ? ' / mês' : ''}`;
  else
    return 'Grátis';
}

export function formatDate(value: Date, hour = false): string {
  if (!value) {
    return '';
  }
  
  if (hour) {
    return new Date(value).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function shortSentence(sentence: string, length: number, readMore: boolean = false): string {
  const readMoreText = readMore ? ' <a class="cursor-pointer text-base text-700 read-more-link">Ler Mais</a>' : '';
  return sentence != null && sentence.length > length 
    ? `${sentence.substring(0, length)}...${readMoreText}` 
    : sentence;
}

export function stripTags(text: string): string {
  return text.replace(/(<([^>]+)>)/gi, '');
}

export function search(searchInput: any): void {
  const router = useRouter();
  
  router.push({
    path: '/p',
    query: {
      search: searchInput
    }
  });
};

export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export function formatSize(bytes): string {
  const $primevue = usePrimeVue();
  
  const k = 1024;
  const dm = 3;
  const sizes = $primevue?.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};

export function formatZipCode(zipCode: string): string {
  if (!zipCode) {
    return '00000-000';
  }
  
  zipCode = zipCode.length !== 8 ? `0${zipCode}` : zipCode;
  return zipCode.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

export function transformReactive(data: any, reactive: any): void {
  if (typeof data !== 'object' || data === null) {
    return; // Just return for non-object inputs
  }

  Object.entries(data).forEach(([key, value]) => {
    reactive[key] = value;
  });
};

export async function loadZipCode(zipCode: string): Promise<any> {
  const zip = zipCode.replace('-', '');
  const { data, status } = await useAsyncData('cep', () => 
    $fetch(`https://opencep.com/v1/${zip}`)
  );
  
  if (status.value !== 'success') {
    return null;
  }

  return data;
}

export function toFormData(data: any, modelPrefix?: string): FormData {
  const formData = new FormData();

  if (typeof data !== 'object' || data === null) {
    return formData; // Return empty FormData for non-object inputs
  }

  for (const [key, value] of Object.entries(data)) {
    const prefixedKey = modelPrefix ? `${modelPrefix}[${key}]` : key;
    formData.append(prefixedKey, value as string | Blob);
  }

  return formData;
}

export function formatPhone(phone: string, country: string = 'BR'): string {
  if (!phone) {
    return '-';
  }

  if (country === 'BR') {
    return phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
  }

  return phone;
}

export function fileToURLEnconder(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
  });
}

export function createObjectURL(file: File): string {
  return URL.createObjectURL(file);
};