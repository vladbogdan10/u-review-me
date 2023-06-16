import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface ICategoryDocument extends ICategory, Document {
  _id: string;
}

const CategorySchema: Schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Category ||
  mongoose.model<ICategoryDocument>('Category', CategorySchema);
