export function cleanup(msg: string) {
  const dirty = ["kerfuffle", "sharbert", "fornax"];

  const words: string[] = msg.split(" ");

  const cleanedWords = words.map((word) => {
    if (dirty.includes(word.toLowerCase())) {
      return "****";
    }
    return word;
  });
  return cleanedWords.join(" ");
}
