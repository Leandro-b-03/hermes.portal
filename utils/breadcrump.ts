export default function breadcrump(path: string): Array<string> {
  const first = path.split('/')[1];
  console.log(first, path);
  const breadcrump = path.split('/').filter((item) => item !== '').map((item) => first === item ? item : `${first}.${item}`);
  breadcrump.unshift('dashboard');
  console.log(breadcrump);
  return breadcrump;
}