const { client } = require("./common");

const seed = async () => {
  try {
    await client.connect();
    console.log("connected to database");
    const SQL = `
    DROP TABLE IF EXISTS notes;
    DROP TABLE IF EXISTS categories;
    CREATE TABLE categories(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    INSERT INTO categories(name) VALUES
    ('Dairy'),
    ('Fruit'),
    ('Grain'),
    ('Vegetable');

    CREATE TABLE notes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        ranking INTEGER DEFAULT 3 NOT NULL,
        category_id INTEGER REFERENCES categories(id) NOT NULL
    );

    INSERT INTO notes(name, ranking, category_id) VALUES
    ('Milk',1, (SELECT id FROM categories WHERE name = 'Dairy')),
    ('Bananas', 2, (SELECT id FROM categories WHERE name = 'Fruit')),
    ('White Rice', 4, (SELECT id FROM categories WHERE name = 'Grain')),
    ('Oats', 5, (SELECT id FROM categories WHERE name = 'Vegetable')),
    ('Strawberries',2, (SELECT id FROM categories WHERE name = 'Fruit')),
    ('Cheese', 1, (SELECT id FROM categories WHERE name = 'Dairy')),
    ('Green Beans', 5, (SELECT id FROM categories WHERE name = 'Vegetable')),
    ('Quinoa', 4, (SELECT id FROM categories WHERE name = 'Grain'));
    `;

    await client.query(SQL);
    console.log("tables created and data seeded");
    await client.end();
  } catch (error) {
    console.log(error);
  }
};

seed();
