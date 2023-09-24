require("dotenv").config();
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
const cookieParser = require("cookie-parser");

const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path = require("path");

const ProductsRouter = require("./routes/Products");
const BrandsRouter = require("./routes/Brands");
const CategoriesRouter = require("./routes/Categories");
const UsersRouter = require("./routes/Users");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");
const OrdersRouter = require("./routes/Orders");
const { User } = require("./model/User");

const server = express();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
console.log(SECRET_KEY);

//! This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.ENDPOINT_SECRET;

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//! JWT options

var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; //TODO - should be in env file

server.use(express.static(path.resolve(__dirname, "build"))); // path resolve
server.use(cookieParser());
server.use(express.json());

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
    secret: process.env.SESSION_KEY,
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
              const token = jwt.sign(
                sanitizeUser(user),
                process.env.JWT_SECRET_KEY
              );
              done(null, { token }); // this is sent to the serializer
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
      const user = await User.findById(jwt_payload.id);
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

//! Payments

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

// const calculateOrderAmount = (items) => {
//   return 1400;
// };

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // because 1400 means 14 rs
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

//TODO we will capture actual order after deploying out server live on public url

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("mongo db connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(process.env.PORT, () => {
  console.log("server is running on port ", process.env.PORT);
});
