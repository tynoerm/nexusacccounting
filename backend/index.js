import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from "cors";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'https://nexusacccounting.vercel.app/', // Your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));

// Connecting to MongoDB Database with options
mongoose.connect("mongodb+srv://nexusaccountingsystem:LaKTVezow57Uwlci@cluster0.6a46o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,  // 30 seconds for connection timeout
  socketTimeoutMS: 30000,   // 30 seconds for socket timeout
})
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });

// Importing Routes
import { quotationRoutes } from './routes/SalesModule/quotation.js';
import { expensesRoutes } from './routes/ExpensesModule/expenses.js';
import { stocksRoutes } from './routes/StockModule/stocks.js';
import { salesRoutes } from './routes/SalesModule/sales.js';

// Route Use
app.use("/quotation", quotationRoutes);
app.use("/expense", expensesRoutes);
app.use("/stock", stocksRoutes);
app.use("/salesmodel", salesRoutes);

// Start Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Connection Established Successfully on " + port);
});
