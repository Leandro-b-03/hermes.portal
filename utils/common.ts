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
  zipCode = zipCode.length !== 8 ? `0${zipCode}` : zipCode;
  return zipCode.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};