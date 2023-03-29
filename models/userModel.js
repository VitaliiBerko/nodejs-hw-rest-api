const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const gravatar = require("gravatar");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },

  token: {
    type: String,
    // select: false
  },
  avatarURL: { type: String },
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    // const emailHash = crypto.createHash('md5').update(this.email).digest('hex')

    this.avatarURL = gravatar.url(
      `${this.email}`,
      { s: "100", r: "x", d: "retro" },
      true
    );
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

const User = model("user", userSchema);

module.exports = User;
