export default function range(start: number, end: number, step: number) {
  const ans = [];
  for (let i = start; i <= end; i += step) {
    ans.push(i);
  }
  return ans;
}
