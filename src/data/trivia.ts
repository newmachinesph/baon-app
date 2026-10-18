import type { TriviaQuestion } from '@/types';

/** 8 Philippine general-knowledge questions; the game surfaces 5 per round. */
export const triviaQuestions: TriviaQuestion[] = [
  {
    id: 'tq-capital',
    prompt: 'What is the capital city of the Philippines?',
    choices: ['Cebu City', 'Manila', 'Davao City', 'Baguio'],
    answerIndex: 1,
  },
  {
    id: 'tq-hero',
    prompt: 'Who is the Philippine national hero?',
    choices: ['Andres Bonifacio', 'Emilio Aguinaldo', 'Jose Rizal', 'Lapu-Lapu'],
    answerIndex: 2,
  },
  {
    id: 'tq-lechon',
    prompt: "What is the main ingredient of the Filipino dish 'lechon'?",
    choices: ['Chicken', 'Pork', 'Beef', 'Fish'],
    answerIndex: 1,
  },
  {
    id: 'tq-river',
    prompt: 'Which is the longest river in the Philippines?',
    choices: ['Pasig River', 'Cagayan River', 'Agusan River', 'Rio Grande de Mindanao'],
    answerIndex: 1,
  },
  {
    id: 'tq-islands',
    prompt: 'How many islands make up the Philippine archipelago?',
    choices: ['3,144', '5,020', '7,641', '10,000'],
    answerIndex: 2,
  },
  {
    id: 'tq-language',
    prompt: 'What is the national language of the Philippines?',
    choices: ['English', 'Cebuano', 'Filipino', 'Spanish'],
    answerIndex: 2,
  },
  {
    id: 'tq-boxer',
    prompt: "Which Filipino boxer is nicknamed 'Pambansang Kamao'?",
    choices: ['Nonito Donaire', 'Manny Pacquiao', 'Flash Elorde', 'Donnie Nietes'],
    answerIndex: 1,
  },
  {
    id: 'tq-mountain',
    prompt: 'What is the highest mountain in the Philippines?',
    choices: ['Mount Pulag', 'Mount Mayon', 'Mount Apo', 'Mount Kanlaon'],
    answerIndex: 2,
  },
];
