import 'dotenv/config';
import dns from 'dns';
// ISP DNS blocks SRV queries needed by mongodb+srv:// — force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = Number(process.env.PORT || 10000);
const mongoUri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB || 'kaalyug';
const origins = (process.env.FRONTEND_ORIGIN || '*').split(',').map(value => value.trim()).filter(Boolean);
let client;
let messages;
let databaseStatus = 'disconnected';
let databaseError = null;

// Yug AI — Gemini setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const YUG_AI_CONTEXT = `# USER CONTEXT & SYSTEM PROMPT FILE
# Target System: Kaliyug OS | AI Identifier: Yug AI

[USER_IDENTITY]
Name: Dirghraj Giri
Age: 18
Current Status: BIT Student (1st Semester)
College: South City College of Science and Technology (Kathmandu University Affiliated)
Location: Madhesh, Nepal
Primary Role: Frontend Developer & Aspiring Full-Stack Developer
Contact Email: giridirghraj@gmail.com

[ONLINE_FOOTPRINT]
GitHub Profile: https://github.com/drj7zz
Instagram Profile: https://www.instagram.com/drj7zz

[CURRENT_PROJECT_AND_ENVIRONMENT]
Operating System Project: Kaliyug OS
OS Native AI Agent: Yug AI
Tech Architecture: Python scripts, Shell commands, Web-based UI layer
Target Career Role: Full-Stack Developer

[TECHNICAL_SKILLS_AND_STACK]
Languages: JavaScript (ES6+), Python, Shell Scripting, HTML5, CSS3, C
Frontend Stack: React, Glassmorphism UI, Responsive Web Design
UI/UX Focus: Clean interface design, intuitive workflows, reliable business logic

[PROJECTS_AND_REPOSITORIES]
Kaliyug OS: Custom operating system environment featuring Yug AI, built with Python scripts, Shell commands, and a Web UI interface.
YugCoin Wallet: Digital cryptocurrency wallet interface focusing on UI state management and transaction UX.
Raty: Review and compliance system for local businesses and organizations to gather structured feedback.
Ausadhi: Medicine search and healthcare resource platform.
MiniChain: Local-first blockchain prototype focusing on core ledger concepts and cryptographic principles.
FocusQuest: Compliance monitoring and financial tracking platform designed for institutional workflows and analytics.

[YUG_AI_PERSONA_AND_INSTRUCTIONS]
AI Name: Yug AI
User Relationship: Casual peer / close dev buddy
Communication Style: Chill, informal, peer-to-peer, clear, direct, and concise.
Operating Constraints: Answer strictly about Dirghraj's portfolio, tech stack, and GitHub projects. If information is outside this context, politely say it is not available.
`;
const YUG_AI_SYSTEM = `You are Yug AI, the native AI assistant of Kaalyug OS — a portfolio operating system built by Dirghraj Giri.

Your job is to answer questions about Dirghraj Giri based ONLY on the context below. Be chill, casual, and concise — like a dev buddy. Never make up information not in the context. If asked something outside the scope, say something like "nah, I only know stuff about Dirghraj's portfolio — try asking about his projects or skills."

CONTEXT:
${YUG_AI_CONTEXT}`;

app.use(cors({ origin: origins.includes('*') ? true : origins }));
app.use(express.json({ limit: '20kb' }));

async function connectDatabase() {
  if (!mongoUri || /PASTE_|YOUR_/i.test(mongoUri)) throw new Error('MONGODB_URI is missing or still a placeholder');
  client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  const db = client.db(databaseName);
  await db.command({ ping: 1 });
  messages = db.collection('messages');
  await messages.createIndex({ createdAt: -1 });
  databaseStatus = 'connected';
  databaseError = null;
  console.log(`MongoDB connected: database=${databaseName}`);
}

app.get('/health', (_req, res) => res.status(databaseStatus === 'connected' ? 200 : 503).json({ ok: databaseStatus === 'connected', service: 'kaalyug-chat', database: databaseStatus, error: databaseError }));

// Yug AI chat endpoint — with retry for transient 503s
app.post('/api/chat', async (req, res) => {
  const question = String(req.body?.question || '').trim().slice(0, 1000);
  if (!question) return res.status(400).json({ error: 'Question is required.' });
  if (!GEMINI_API_KEY) return res.status(503).json({ error: 'Yug AI is not configured. Set GEMINI_API_KEY in .env.' });

  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 1500;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        systemInstruction: YUG_AI_SYSTEM,
      });
      const result = await model.generateContent(question);
      const answer = result.response.text();
      return res.json({ answer });
    } catch (error) {
      const is503 = error.message && error.message.includes('503');
      console.error(`Gemini attempt ${attempt} failed:`, error.message);
      if (attempt < MAX_RETRIES && is503) {
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      return res.status(503).json({
        error: 'Yug AI is temporarily unavailable. Please try again in a moment.',
        details: error.message,
      });
    }
  }
});

app.get('/api/messages', async (_req, res) => {
  if (!messages) return res.status(503).json({ error: 'MongoDB is not connected.', details: databaseError });
  try { res.json((await messages.find({}).sort({ createdAt: -1 }).limit(100).toArray()).reverse()); }
  catch (error) { res.status(503).json({ error: 'Unable to read messages.', details: error.message }); }
});

app.post('/api/messages', async (req, res) => {
  const user = String(req.body?.user || '').trim().slice(0, 40);
  const text = String(req.body?.text || '').trim().slice(0, 2000);
  if (!user || !text) return res.status(400).json({ error: 'Username and message are required.' });
  if (!messages) return res.status(503).json({ error: 'MongoDB is not connected.', details: databaseError });
  try { const message = { user, text, createdAt: new Date() }; const result = await messages.insertOne(message); res.status(201).json({ ...message, _id: result.insertedId }); }
  catch (error) { res.status(503).json({ error: 'Unable to save message.', details: error.message }); }
});

app.listen(port, async () => {
  console.log(`Kaalyug backend listening on http://localhost:${port}`);
  try { await connectDatabase(); }
  catch (error) { databaseStatus = 'error'; databaseError = error.message; console.error(`MongoDB connection failed: ${error.message}`); }
});
