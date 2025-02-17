const jwt = require("jsonwebtoken");

const users = [
  { username: "admin", password: "1234" },
  { username: "user", password: "abcd" },
];

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ statusCode: 400, message: "Campos vacíos" });
  }

  const user = users.find((u) => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ statusCode: 401, message: "Credenciales incorrectas" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1m" });

  res.json({
    statusCode: 200,
    intDataMessage: [{ credentials: token }],
  });
};

module.exports = { login };
