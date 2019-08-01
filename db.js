// holding the connection to the db.
// holding the biz functions.

var mongoose = require("mongoose");

var URL =
  "mongodb+srv://huynhnhu:Huynhnhutran@72@myqldh-j9yde.mongodb.net/test?retryWrites=true&w=majority";

mongoose.set("useFindAndModify", false);

var db = mongoose.connection;

async function connect(User, Pass) {
  mongoose.connect(URL, {
    useNewUrlParser: true
  });

  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", function() {
    return "Connection Successful!";
  });
}

const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  job: String
});
const ProShema = mongoose.Schema({
  Ma: String,
  Ten: String,
  Loai: String,
  Gia: Number
});
const TypeShema = mongoose.Schema({
  maTL: String,
  ten: String
});
const ProModel = db.model("PRODUCT", ProShema, "Product");
async function getDataPro() {
  let data = await ProModel.find({});
  return data;
}
const TypeModel = db.model("THELOAI", TypeShema, "TheLoai");
async function getDataType() {
  let data = await TypeModel.find({});
  return data;
}
//const name = db.model('Ten model', schema, ten bang du lieu)
const UserModel = db.model("User", UserSchema, "USER");
async function getData() {
  const data = await UserModel.find({});
  return data;
}
//lay id loai
async function getTypeById(typeId) {
  if (!typeId) {
    return null;
  }
  return await TypeModel.find({ _id: typeId });
}
// lay id san pham
async function getProductById(productId) {
  if (!productId) {
    return null;
  }
  return await ProModel.find({ _id: productId });
}

async function getUserById(UserId) {
  if (mongoose.Types.ObjectId.isValid(UserId)) {
    const user = await UserModel.findOne({ _id: UserId });
    return user;
  }
  throw new Error("ID is invalid");
}

async function getUserByName(UserName) {
  await UserModel.find({ name: UserName }, function(err, res) {
    if (err) throw err;
  });
  return user;
}
//them sanpham
async function addNewPro(newPro) {
  const productId = new ProModel(newPro);
  return await productId.save();
}

//them theloai
async function addNewType(newType) {
  const typeId = new TypeModel(newType);
  return await typeId.save();
}

//them user
async function addNewUser(newUser) {
  const user = new UserModel(newUser);
  return await user.save();
}
//cap nhat san pham
async function updatePro(productId, data) {
  if (mongoose.Types.ObjectId.isValid(productId)) {
    return await ProModel.findOneAndUpdate({ _id: productId }, data, function(
      err,
      doc
    ) {
      if (err) throw err;
      return doc;
    });
  }
  throw new Error("ID product is invalid");
}
//cap nhat User
async function updateUser(UserId, data) {
  if (mongoose.Types.ObjectId.isValid(UserId)) {
    return await UserModel.findOneAndUpdate({ _id: UserId }, data, function(
      err,
      doc
    ) {
      if (err) throw err;
      return doc;
    });
  }
  throw new Error("ID user is invalid");
}
//xoa san pham
async function deletePro(productId) {
  const isCheck = await getProductById(productId);
  if (isCheck == null || isCheck == undefined) {
    return { message: "Not found" };
  }
  await ProModel.remove({ _id: productId });
  {
    message: "Remove successfully";
  }
}
//xoa user
async function deleteUser(UserId) {
  if (mongoose.Types.ObjectId.isValid(UserId)) {
    return await UserModel.findByIdAndRemove({ _id: UserId }, function(
      err,
      res
    ) {
      if (err) throw err;
      return res;
    });
  }
}

module.exports = {
  connect,
  getData,
  getUserById,
  getUserByName,
  addNewUser,
  updateUser,
  deleteUser,
  getDataPro,
  getDataType,
  getProductById,
  getTypeById,
  addNewPro,
  addNewType,
  updatePro,
  deletePro
};
