const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "34.79.249.65",
  database: "postgres",
  password: "fx2qGG1ctyy78uaD",
  port: "5432"
});

exports.insertImage = (imageName, date) => {
    const query = {
        text: 'INSERT INTO public."IMAGES"("imagePath", "dateToShow") VALUES ($1, $2);',
        values: [imageName, new Date(date)],
      }
    pool.query(
        query,
        (err, res) => {
          console.log(err, res);
          pool.end();
        }
      );
}
