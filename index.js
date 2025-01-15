const { express, client } = require("./common");
const app = express();
const PORT = process.env.PORT || 3000;

// parse the body into JS Objects
app.use(express.json());

// Log the requests as they come in
app.use(require("morgan")("dev"));

/*Read Employees*/
app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = `
      SELECT * FROM employees ORDER BY created_at DESC
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

/*Read Departments*/
app.get("/api/departments", async (req, res, next) => {
  try {
    const SQL = `
      SELECT * FROM departments 
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

/*Create Employee*/
app.post("/api/employees", async (req, res, next) => {
  try {
    const { name, departments_id } = req.body;
    const SQL = `
      INSERT INTO employees(name, departments_id)
      VALUES($1, (SELECT id FROM departments WHERE name = $2))
      RETURNING *
    `;
    const response = await client.query(SQL, [name, departments_id]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

/*Update Employee*/
app.put("/api/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const SQL = `
      UPDATE employees
      SET departments_id = (SELECT id FROM departments WHERE name = $2), updated_at=now()
      WHERE id = $1 
      RETURNING *
    `;
    const response = await client.query(SQL, [id, name]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

/*Delete Employee*/
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
      DELETE from employees
      WHERE id = $1
    `;
    const response = await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, async () => {
  await client.connect();
  console.log(`I am listening on port number ${PORT}`);
});
