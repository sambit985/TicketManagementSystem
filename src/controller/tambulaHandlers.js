const { parse } = require('querystring');
const { getDb } = require('../db/conn');
const generateTambulaTicket = require('../ticketGenerator');

async function handleCreateTicket(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { tickets } = JSON.parse(body);

      // Generate Tambula ticket
      const tambulaTicket = generateTambulaTicket();

      // Get the database instance
      const db = getDb();

      // Insert the ticket into the database
      const result = await db.collection('tambula_tickets').insertOne(tambulaTicket);
      const ticketId = result.insertedId;

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Tambula ticket created successfully', ticketId }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  });
}

async function handleFetchTickets(req, res) {
  const { page, limit } = parsedUrl.query;
  try {
    // Get the database instance
    const db = getDb();

    // Fetch tickets with pagination
    const tickets = await db
      .collection('tambula_tickets')
      .find()
      .skip(parseInt(page) * parseInt(limit))
      .limit(parseInt(limit))
      .toArray();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ tickets }));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
}

module.exports = { handleCreateTicket, handleFetchTickets };
