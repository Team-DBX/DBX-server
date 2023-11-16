/* eslint-disable no-undef */
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");
const User = require("../models/User");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const login = async function (req, res, next) {
  const idToken = req.body.idToken;
  const email = req.body.email;
  const isLogin = req.body.login;

  if (!idToken) {
    res.status(400).json({
      result: "Error",
      message: "Both idToken and email are required",
    });
    return;
  }

  try {
    const userCount = await User.countDocuments();
    const authenticatedUser = await getAuth().verifyIdToken(idToken);
    const user = await User.findOne({ email: authenticatedUser.email });

    if (authenticatedUser.email !== email) {
      throw new Error("Unauthorized");
    }

    if (!user && isLogin) {
      new User({
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        isAdmin: true,
      }).save();
    }

    if (!userCount && isLogin) {
      res.json({
        result: "OK",
        isInitialUser: true,
        isUser: true,
        isAdmin: user ? user.isAdmin : true,
      });

      return;
    }

    res.json({
      result: "OK",
      isInitialUser: false,
      isUser: true,
      isAdmin: user ? user.isAdmin : true,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      res.statusCode = 401;
      res.json({
        result: "Error",
        message: "401 Invalid User",
      });

      return;
    } else {
      next(error);
    }
  }
};

module.exports = {
  login: login,
};
