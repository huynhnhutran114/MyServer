// call db's functions & returns to web clients.

//{
//    message: "",
//    data: ...
//}

const http = require("http");
const koa = require("koa");
const KOA_Router = require("koa-router");
const koaBody = require("koa-body");
const callback = require("./Callback");

var app = new koa();
var router = new KOA_Router();

const database = require("./db");

function listen(host, port) {
  app.use(koaBody());
  app.use(router.routes());
  app.use(router.allowedMethods());

  return new Promise((resolve, reject) => {
    console.log("listen(..)");
    http.createServer(app.callback()).listen(port, host, function(err) {
      if (err) {
        return reject(err);
      }
      console.log("Listening on port:" + port);
      resolve();
    });
  });
}

router.get("/hello", async (ctx, next) => {
  console.log("Thanh cong");
  ctx.body = "hello world";
});

//the loai
router.get("/TheLoai", async (ctx, next) => {
  var data = await database.getDataType();
  ctx.body = data;
});

//san pham
router.get("/SanPham", async (ctx, next) => {
  var data = await database.getDataPro();
  ctx.body = data;
});
router.get("/Data", async (ctx, next) => {
  var data = await database.getData();
  ctx.body = data;
});
//lay id the loai
router.get("/TheLoaiById", async ctx => {
  const typeId = ctx.query._id;
  const result = await database.getTypeById(typeId);
  if (!result) {
    return (ctx.body = { messsge: "No id not foud" });
  }
  ctx.body = result;
});
//lay id san pham
router.get("/SanPhamById", async ctx => {
  // const result = await database.getProductById(ctx.params.productId);
  const productId = ctx.query._id;
  const result = await database.getProductById(productId);
  if (!result) {
    return (ctx.body = { messsge: "No id not foud" });
  }
  ctx.body = result;
});

router.get("/User/", async (ctx, next) => {
  var data = await database
    .getUserById(ctx.query.id)
    .then(() => {
      if (!data) ctx.status = 404;
      ctx.body = data;
    })
    .catch(err => {
      ctx.status = 400;
      ctx.body = "ID is invalid";
    });
});

router.get("/User", async (ctx, next) => {
  var data = await database
    .getUserByName(ctx.query.name)
    .then()
    .catch();
  ctx.body = data;
});
//them product
router.post("/SanPham", async (ctx, next) => {
  // var newProduct = JSON.parse(JSON.stringify(ctx.request.body));
  const newProduct = ctx.request.body;
  ctx.body = database.addNewPro(newProduct);
});

//them type
router.post("/TheLoai", async (ctx, next) => {
  const addNewType = ctx.request.body;
  ctx.body = database.addNewType(addNewType);
});
//them user
router.post("/User", async (ctx, next) => {
  var user = JSON.parse(JSON.stringify(ctx.request.body));
  ctx.body = database.addNewUser(user);
});
//up date san pham
router.put("/SanPham/", async (ctx, next) => {
  const productId = ctx.request.body;
  await database
    .updatePro(productId._id, productId)
    .then(data => {
      if (!data) ctx.body = data;
      ctx.status = 404;
    })
    .catch(() => {
      ctx.status = 404;
      ctx.body = "ID is invalid";
    });
});

// update user
router.put("/User/", async (ctx, next) => {
  var user = JSON.parse(JSON.stringify(ctx.request.body));
  await database
    .updateUser(user.id, user)
    .then(data => {
      if (!data) ctx.body = data;
      ctx.status = 404;
    })
    .catch(() => {
      ctx.status = 400;
      ctx.body = "ID is invalid";
    });
});
//xoa san pham
router.delete("/SanPham/", async (ctx, next) => {
  const productId = await database
    .deletePro(ctx.query.id)
    .then(callback.success)
    .catch(callback.failure);
  if (!productId) ctx.status = 200;
  ctx.status = 400;
  ctx.body = "ID is invalid";
});
//xoa user
router.delete("/User/", async (ctx, next) => {
  const user = await database
    .deleteUser(ctx.query.id)
    .then(callback.success)
    .catch(callback.failure);
  if (!user) ctx.status = 200;
  ctx.status = 400;
  ctx.body = "ID is invalid";
});

router.get("/", async (ctx, next) => {
  ctx.body = "Hello Như";
});

module.exports = {
  listen,
  router
};
