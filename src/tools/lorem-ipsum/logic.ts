/**
 * Lorem Ipsum Generator Logic
 */

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "at",
  "vero",
  "eos",
  "accusamus",
  "iusto",
  "odio",
  "dignissimos",
  "ducimus",
  "blanditiis",
  "praesentium",
  "voluptatum",
  "deleniti",
  "atque",
  "corrupti",
  "quos",
  "dolores",
  "quas",
  "molestias",
  "excepturi",
  "occaecati",
  "cupiditate",
  "provident",
  "similique",
  "mollitia",
  "vitae",
  "dicta",
  "explicabo",
  "nemo",
  "ipsam",
  "quia",
  "voluptas",
  "aspernatur",
  "aut",
  "odit",
  "fugit",
  "totam",
  "rem",
  "aperiam",
];

/**
 * Generate lorem ipsum words
 */
export function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  return words.join(" ");
}

/**
 * Generate lorem ipsum sentences
 */
export function generateSentences(count: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words per sentence
    const words = generateWords(wordCount);
    const sentence = words.charAt(0).toUpperCase() + words.slice(1) + ".";
    sentences.push(sentence);
  }
  return sentences.join(" ");
}

/**
 * Generate lorem ipsum paragraphs
 */
export function generateParagraphs(count: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-7 sentences per paragraph
    const paragraph = generateSentences(sentenceCount);
    paragraphs.push(paragraph);
  }
  return paragraphs.join("\n\n");
}

/**
 * Generate lorem ipsum with specific options
 */
export function generateLorem(
  type: "words" | "sentences" | "paragraphs",
  count: number,
  startWithLorem: boolean = true
): string {
  let result = "";

  switch (type) {
    case "words":
      result = generateWords(count);
      break;
    case "sentences":
      result = generateSentences(count);
      break;
    case "paragraphs":
      result = generateParagraphs(count);
      break;
  }

  // Ensure it starts with "Lorem ipsum" if requested
  if (
    startWithLorem &&
    result &&
    !result.toLowerCase().startsWith("lorem ipsum")
  ) {
    if (type === "words") {
      const words = result.split(" ");
      words[0] = "Lorem";
      words[1] = "ipsum";
      result = words.join(" ");
    } else {
      result = result.replace(/^[A-Z]\w+\s+\w+/, "Lorem ipsum");
    }
  }

  return result;
}

/**
 * Get word count from text
 */
export function getWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Get character count from text
 */
export function getCharCount(text: string): number {
  return text.length;
}

/**
 * Get sentence count from text
 */
export function getSentenceCount(text: string): number {
  return text.split(/[.!?]+/).filter(Boolean).length;
}

/**
 * Get paragraph count from text
 */
export function getParagraphCount(text: string): number {
  return text.split(/\n\n+/).filter(Boolean).length;
}
