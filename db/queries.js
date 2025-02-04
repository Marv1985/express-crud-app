const pool = require("./pool");

async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM usernames");
  return rows;
}

async function insertUsername(firstname, lastname, email) {
  await pool.query("INSERT INTO usernames (firstname, lastname, email) VALUES ($1, $2, $3)", [firstname, lastname, email]);
}

async function deleteUsername(id) {
  await pool.query("DELETE FROM usernames WHERE id = ($1)", [id]);
}

async function getUsername(id) {
  const { rows } = await pool.query("SELECT * FROM usernames WHERE id = ($1)", [id]);
  return rows
}

async function updateUsername(id, firstname, lastname, email) {
  await pool.query("UPDATE usernames SET ($1, $2, $3, $4) WHERE id = ($1)", [id, firstname, lastname, email]);
}

async function searchUser(searchName) {
  const { rows } = await pool.query("SELECT firstname, lastname, email, id FROM usernames WHERE LOWER(firstname) = ($1)", [searchName]);
  return rows;
}

module.exports = {
  getAllUsernames,
  insertUsername,
  deleteUsername,
  getUsername,
  updateUsername,
  searchUser
};
