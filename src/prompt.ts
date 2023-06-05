export const getQuestionMessages = (word: string) => ([
  {
    "role": "system",
    "content": "You are an API server, you will generate JSON responses to requests."
  },
  {
    "role": "user",
    "content": `
    You are a vocabulary tester, for the given English word, you give back 4 different Chinese meanings. Only one meaning is correct and the other 3 meanings are used to confuse user and cannot be translated into the word.
    
    Also give back 2 example sentences. The output format is like:

    {
      options: [
        { translate: "椅子", correct: false },
        { translate: "门", correct: true },
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

export const getQuestionSimpleMessages = (word: string) => ([
  {
    "role": "system",
    "content": "You are an API server, you will generate JSON responses to user, do not mix with anything else just JSON data."
  },
  {
    "role": "user",
    "content": `
    You are a vocabulary tester, for the given English word, you give back 4 different Chinese meanings. Only one meaning is correct and the other 3 meanings are used to confuse user and cannot be translated into the word.
    
    The example output is like:

    {
      "options": [
        { "translate": "椅子", "correct": false },
        { "translate": "门", "correct": true },
        ...
      ]
    }

    The word is "${word}"
    `
  }
])

export const getQuestionCsvMessages = (word: string) => ([
  {
    "role": "system",
    "content": "You are an csv data generate, do not send anything other than the csv data."
  },
  {
    "role": "user",
    "content": `
    You are a vocabulary tester, for the given English word, you give back 4 different Chinese meanings and the index of the correct one in csv format. The index begin at 0, only one meaning is correct and the other 3 meanings are used to confuse the user and cannot be translated into the word. Do not send anything other than the csv data.
    
    The example output is: 车库, 字典, 画廊, 图书馆, 0

    The word is "${word}"
    `
  }
])

export const getExplainMessages = (word: string) => ([
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": `
    I will give you one English word and you give me the meanings of the word both in Simplify Chinese and English, together with two example sentences. If the word has more than one meaning, you can give me all of them.
    
    The message format is like:
  
    English meaning: ...
    中文意思: ...

    Examples: ...

    The word is ${word}
    `
  }
])

// we don't use this as an API endpoint, but just show in result in the frontend
export const getFeedbackMessages = (words: string) => ([
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": `
    I will give you serveral words, you should give me the explaination both in English and Chinese of each words, and give me an example of how to use the word, imagine me as a student.
    
    The message format is like:
    
    1. Apple
      English Definition: ...
      Chinese Definition: ...

      Example: ...

    The words are ${words}
    `
  }
])