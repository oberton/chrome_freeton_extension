export default function (phrase = '') {
  const phraseLength = phrase.trim().split(' ').length;
  return phraseLength === 12 || phraseLength === 24;
}
