const pg = require("pg");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const client = new pg.Client(
  process.env.DATABASE_URL ||
    `postgres://postgres:${process.env.MY_PASSWORD}@localhost:5432/acme_notes_categories_db`
);

module.exports = { express, client };
