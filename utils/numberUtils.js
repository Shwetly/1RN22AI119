const NUMBER_TYPES = {
  'p': 'primes',
  'f': 'fibo',
  'e': 'even',
  'r': 'rand'
};

const validateNumberId = (req, res, next) => {
  const numberid = req.params.numberid;
  if (!NUMBER_TYPES[numberid]) {
    return res.status(400).json({ error: 'Invalid number type. Use p, f, e, or r' });
  }
  req.numberType = NUMBER_TYPES[numberid];
  next();
};

const updateWindow = (window, newNumbers, windowSize) => {
  const updatedWindow = [...window];
  
  newNumbers.forEach(num => {
    if (!updatedWindow.includes(num)) {
      if (updatedWindow.length >= windowSize) {
        updatedWindow.shift();
      }
      updatedWindow.push(num);
    }
  });
  
  return updatedWindow;
};

const calculateAverage = (numbers) => {
  return numbers.length > 0 
    ? numbers.reduce((sum, num) => sum + num, 0)/numbers.length
    : 0;
};

module.exports = {
  validateNumberId,
  updateWindow,
  calculateAverage
};