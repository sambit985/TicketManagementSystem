function generateTambulaTicket() {
    const tickets = {
      ticket1: [],
      ticket2: [],
      ticket3: [],
      ticket4: [],
      ticket5: [],
      ticket6: [],
    };
  
    const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
    const columns = Array.from({ length: 9 }, (_, i) => i * 10);
  
    // Shuffle the numbers array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
  
    for (let i = 1; i <= 6; i++) {
      for (let j = 0; j < 3; j++) {
        const row = [];
        for (let k = 0; k < 9; k++) {
          if (k === 0 || (k > 0 && Math.random() < 0.5 && row.length < 5)) {
            if (numbers.length > 0) {
              row.push(numbers.pop());
            } else {
              row.push("x"); // Use "x" for blank cells
            }
          } else {
            row.push("x"); // Use "x" for blank cells
          }
        }
        row.sort((a, b) => a - b); // Sort non-zero numbers in ascending order
        tickets[`ticket${i}`].push(row);
      }
    }
  
    return { tickets };
  }
  
  module.exports = generateTambulaTicket;
  