import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongoData = {
    uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}${process.env.DB_PORT ? ':' + process.env.DB_PORT : ''}/${process.env.DB_DATABASE}${process.env.DB_OPTIONS}`,
    options: {}
};
export async function openMongooseConnection() {
    try {
        mongoose.connect(mongoData.uri, mongoData.options);
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}
export async function closeMongooseConnection() {
    await mongoose.disconnect();
}
//# sourceMappingURL=mongoose.service.js.map