export default function breadcrump(path: string): Array<string> {
  const breadcrump = path.split('/').filter((item) => item !== '');
  breadcrump.unshift('dashboard');
  return breadcrump;
}