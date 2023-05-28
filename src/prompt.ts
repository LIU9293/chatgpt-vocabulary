export const getOptionMessages = (word: string) => ([
  {"role": "system","content": "You are an API server, you will generate JSON responses to requests."},
  {
    "role": "user",
    "content": `
    You are a vocabulary tester, for the given English word, you give back 4 different Chinese meanings (must not be synonym). Only one meaning is correct and the other 3 meanings are used to confuse user and cannot be translated into the word.
    
    Also give back 2 example sentences. The output format is like:

    {
      options: [
        { translate: "椅子", correct: false },
        { translate: "门", correct: true },
        { translate: "桌子", correct: false },
        { translate: "门铃", correct: false },
        ...
      ],
      example_sentences: [
        { 
          english: ..., 
          chinese: ...
        }
      ]
    }

    The word is "${word}"
    `
  }
])