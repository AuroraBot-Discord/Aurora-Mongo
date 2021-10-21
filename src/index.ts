

import * as mongoose from "mongoose";
import JSONB from "json-bigint";
import { Document, Schema, Types, SchemaDefinition, Model, model } from "mongoose"
/**
 * 
 * @param {string} uri MongoDBとの接続で使用します。
 * @example mongo.connect(`mongodb+srv://username:password@hoge.rhaqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
 */
async function connect(uri: string) {
  mongoose.connect(uri);
};


//Schema
interface schemaFields {
  key: string;
  value: string;
}

const schemaFields: SchemaDefinition<schemaFields> = {
  key: String,
  value: String
};

interface schemaProperties extends schemaFields {}

const schema: Schema<schemaProperties> = new Schema({
  key: String,
  value: String
})

interface tempModel extends Model<schemaProperties> { }

interface tempDocument extends Document, schemaProperties { }

//class
class Database {
  public name: string;
  public model: tempModel;

  /**
   * 
   * @param {string} name MongoDBのモデルの名前。
   */
  constructor(name: string) {
    this.name = name;

    this.model = model<tempDocument, tempModel>(name, schema);
  }
  async dget(key: string) {
    const data = await this.model.findOne({ key });
    return data;
  }
  async get(key: string) {
    const data = await this.dget(key);
    if (!data) return null;
    return JSONB.parse(data.value);
  }
  async set(key: string, value: unknown) {
    const data = await this.dget(key) || new this.model();
    data.key = key;
    data.value = JSONB.stringify(value);
    data.save();
  }
  async has(key:string) {
    const data = await this.dget(key);
    if (!data) return false;
    return true;
  }
  async delete(key:string) {
    const data = await this.dget(key);
    if (!data) return null;
    return data.remove();
  }
  async clear() {
    this.model.remove();
  }
  /**
   * 
   * @returns {Promise<string[]>} キーの配列が返ってきます。 
   */
  async keys(): Promise<string[]> {
    const data = await this.model.find();
    const filteredData = data.map(v => v.key);
    return filteredData;
  }
  /**
   * 
   * @returns {Promise<any[]>} 値の配列が返ってきます。 
   */
  async values(): Promise<any[]> {
    const data = await this.model.find();
    const filteredData = data.map(v => JSONB.parse(v.value));
    return filteredData;
  }
  async entries() {
    const data = await this.model.find();
    const filteredData = data.map(v => { return [v.key, JSONB.parse(v.value)] });
    return filteredData;
  }
  
}
export { connect, Database };