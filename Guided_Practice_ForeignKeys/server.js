const { express, client } = require("./common");
const app = express();
const PORT = process.env.PORT || 3000;

// parse the body into JS Objects
app.use(express.json());

// Log the requests as they come in
app.use(require("morgan")("dev"));

/*Read Categories*/
app.get("/api/categories", async (req, res, next) => {
  try {
    const SQL = `
    SELECT categories.name, notes.name AS notes_name FROM categories 
    INNER JOIN notes on notes.category_id  = categories.id
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

/*Read Notes*/
app.get("/api/notes", async (req, res, next) => {
  try {
    const SQL = `
      SELECT * FROM notes ORDER BY created_at DESC
      `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

/*Create Note*/
app.post("/api/notes", async (req, res, next) => {
  try {
    const { name, category_id } = req.body;
    const SQL = `
      INSERT INTO notes(name, category_id)
      VALUES($1, (SELECT id FROM categories WHERE name = $2))
      RETURNING *
    `;
    const response = await client.query(SQL, [name, category_id]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

/*Update Note*/
app.put("/api/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    console.log(name);
    const SQL = `
      UPDATE notes
      SET category_id = (SELECT id FROM categories WHERE name = $2), updated_at=now()
      WHERE id = $1
      RETURNING *
    `;
    const response = await client.query(SQL, [id, name]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

/*Delete Note*/
app.delete("/api/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
        DELETE from notes
        WHERE id = $1
      `;
    const response = await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.listen(PORT, async () => {
  await client.connect();
  console.log(`I am listening on port ${PORT}`);
});
