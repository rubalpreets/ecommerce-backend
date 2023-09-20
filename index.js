const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const { isAuth, sanitizeUser } = require("./services/common");

const ProductsRouter = require("./routes/Products");
const BrandsRouter = require("./routes/Brands");
const CategoriesRouter = require("./routes/Categories");
const UsersRouter = require("./routes/Users");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");
const OrdersRouter = require("./routes/Orders");
const { User } = require("./model/User");

const server = express();

const SECRET_KEY = "SECRET_KEY_SAPIENS";

//! JWT options

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY; //TODO - should be in env file

//! middlewares

server.use(
  cors({
    origin: ["http://localhost:3003"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);

server.use(passport.authenticate("session"));

server.use(express.json()); // to parse req.body

server.use("/products", isAuth(), ProductsRouter.router);
server.use("/categories", isAuth(), CategoriesRouter.router);
server.use("/brands", isAuth(), BrandsRouter.router);
server.use("/users", isAuth(), UsersRouter.router);
server.use("/auth", AuthRouter.router);
server.use("/cart", isAuth(), CartRouter.router);
server.use("/orders", isAuth(), OrdersRouter.router);

//Local Stratergy for passport

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    try {
      const query = User.findOne({ email: email });
      const user = await query.exec();

      if (!user) {
        done(null, false, {
          message: "Wrong Credentials",
        });
      } else {
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "Wrong Credentials" });
            } else {
              const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
              done(null, token); // this is sent to the serializer
            }
          }
        );
      }
      // TODO password encription using password js
    } catch (err) {
      done(err);
    }
  })
);

// jWT strtergy

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizeUser(user)); // this is calling serializer
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      if (err) {
        return done(err, false);
      }
    }
  })
);

// this creates session variable req.user on being called from callbacks

passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this creates session variable req.user when called from auth

passport.deserializeUser(function (user, cb) {
  console.log("de-serializ", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("mongo db connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(8080, () => {
  console.log("server is running on port ", 8080);
});
