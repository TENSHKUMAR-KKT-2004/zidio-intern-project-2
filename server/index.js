import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


mongoose.connect("mongodb+srv://jobPortal:TlfvkkZNkkoGWp0G@blog.dm0zbcz.mongodb.net/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(() => {
    console.log("DB connected");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    score:Number,
})

const User = new mongoose.model("User", userSchema)

//Routes


app.post("/login", async (req, res)=> {
    const { email, password} = req.body;
    try {
        const user = await User.findOne({ email: email }).exec();
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successful", user: user});
            } else {
                res.send({ message: "Password didn't match"});
            }
        } else {
            res.send({message: "User not registered"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
app.post("/register", async (req, res)=> {
    const { name, email, password} = req.body;
    try {
        const existingUser = await User.findOne({email: email}).exec();
        if(existingUser){
            res.send({message: "User already registered"});
        } else {
            const newUser = new User({
                name,
                email,
                password
            });
            await newUser.save();
            res.send({ message: "Successfully Registered, Please login now." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.post('/setscore',async(req,res)=>{
    const user = req.body.user;
    const newUser = await User.findOne({email:user});
    if(!newUser)
    {
        newUser.score=req.body.score;
        await newUser.save();
        return res.send("Score Stored")
       
    }
    console.log(user);
    return res.send("here");
    
})

app.get("/info", async (req, res) => {
    const { email } = req.headers;
    try {
        const user = await User.findOne({ email: email }).exec();
        if (user) {
            res.send({ valid: true, score: user.score });
        } else {
            res.send({ valid: false, score: null });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.listen(9002,() => {
    console.log("BE started at port 9002")
})