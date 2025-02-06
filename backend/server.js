const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Routers
const AuthRouter = require('./routers/auth.router')
const UserRouter = require('./routers/user.router')
const AdminRouter = require('./routers/admin.router')
const ProductRouter = require('./routers/product.router')
const OrderRouter = require('./routers/order.router')
const authenticateToken = require("./middleware/authentication.middleware")

require('dotenv').config();
app.use(express.json({ limit: '50mb' })); // Increase the limit to 50MB
const Paypal = require('./routers/paypal.router')
const cors = require("cors")

const corsOptions = {
    // origin: "http://localhost:5173",
    origin:"https://inventorymanagmentsystembackend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));

const db = async () => {
    try {
        await mongoose.connect(`${process.env.db_url}/${process.env.db_name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('db connected Successfully');
    } catch (error) {
        console.log("Database connection failed:", error);
    }
};

db()
app.use("/check",(req,res)=>{
    res.send("Working API");
})
app.use('/api/paypal', Paypal)
app.use('/api/order', OrderRouter)
app.use('/api/user', UserRouter)
app.use('/api/auth', AuthRouter)
app.use('/api/admin', authenticateToken, AdminRouter)
app.use('/api/product', authenticateToken, ProductRouter)

app.listen(process.env.port, () => {
    console.log(`Server is running ${process.env.port} `)
}) 
