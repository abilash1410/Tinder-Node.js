const mongoose = require('mongoose');

const uri = "mongodb+srv://abilash1410:<password>@nodejs.otezc.mongodb.net/nodeJS";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const connectDB = async () => {
    try{
        await mongoose.connect(uri,clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }catch(e){
        

    }finally{
     //Ensures that the client will close when you finish/error
     // await mongoose.disconnect();
    }
}
module.exports = {connectDB}









