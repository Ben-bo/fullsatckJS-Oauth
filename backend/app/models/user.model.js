module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      email: {
        type: String,
      },
      nama: {
        type: String,
      },
      password: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );
  //mengubah struktur schema default ke object yng diinginkan
  //jika menggunaka errow function maka toObject akan error
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("users", schema);
  return User;
};
