export default function breadcrump(path: string): Array<string> {
  const first = path.split('/')[1];
  const breadcrump = path.split('/').filter((item) => item !== '').map((item) => first === item ? item : `${first}.${item}`);
  breadcrump.unshift('dashboard');
  return breadcrump;
}