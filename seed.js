const { client } = require("./common");

const seed = async () => {
  try {
    await client.connect();
    console.log("connected to database");
    const SQL = `
    DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL     
    );
    INSERT INTO departments(name) VALUES 
    ('Human Resource'),
    ('Loading'),
    ('Receiving'),
    ('Engineering'),
    ('Replenishment');

    CREATE TABLE employees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        departments_id INTEGER REFERENCES departments(id) NOT NULL
    );

    INSERT INTO employees(name, departments_id) VALUES
    ('Jasmine Carter',  (SELECT id from departments WHERE name ='Human Resource')),
    ('Dorothy Smith', (SELECT id from departments WHERE name ='Loading')),
    ('Carter Porter', (SELECT id from departments WHERE name ='Engineering')),
    ('Dorothy Smith', (SELECT id from departments WHERE name ='Loading')),
    ('Jackie Frost', (SELECT id from departments WHERE name ='Human Resource')),
    ('John Roper', (SELECT id from departments WHERE name ='Replenishment')),
    ('Issac Macklamore', (SELECT id from departments WHERE name ='Engineering')),
    ('Rosanna Jones', (SELECT id from departments WHERE name ='Replenishment'));   
   `;

    await client.query(SQL);
    console.log("tables created and data seeded");
    await client.end();
  } catch (error) {
    console.log(error);
  }
};

seed();
