const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const he = require('he');
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Gets rid of the weird "&amp" with the questions
const cleanData = (question) => {
  return {
    ...question,
    question: he.decode(question.question),
    correct_answer: he.decode(question.correct_answer),
    incorrect_answers: question.incorrect_answers.map(answer => he.decode(answer))
  };
};

// Endpoint to fetch quiz data
app.get('/api/questions', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=50&category=22&type=multiple');
    const cleanedData = response.data.results.map(cleanData); //makes an array where each element has the properties of the questions
    res.json(cleanedData);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

// Updated endpoint to check the answer and log it
app.post('/api/check-answer', (req, res) => {
  const { userAnswer, correctAnswer } = req.body;
  const isCorrect = (userAnswer === correctAnswer); //checks if answer is correct
  console.log(`User answer: "${userAnswer}", Correct answer: "${correctAnswer}", Is correct: ${isCorrect}`);
  res.json({ isCorrect });
});

//Port for backend and getting information from API
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});