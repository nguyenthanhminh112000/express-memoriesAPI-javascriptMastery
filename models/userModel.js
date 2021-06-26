import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  id: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, require: true },
});

export default mongoose.model('User', userSchema);
