export default function formatTime(date) {
  const params = date.toString().split(' ');
  return [params[2], params[1], params[3]].join(' ');
}
