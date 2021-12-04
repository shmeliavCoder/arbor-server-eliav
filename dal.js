const { Pool, Client } = require("pg");

let pool

exports.initPool = () => {
  try {
    pool = new Pool({
      user: "postgres",
      host: "34.79.249.65",
      database: "postgres",
      password: "fx2qGG1ctyy78uaD",
      port: "5432"
    });
  }
  catch (err) {
    console.log("Failed to start pool", err)
  }

}


exports.insertImage = async (imageName, date) => {
  let client;
  const query = {
    text: 'INSERT INTO public."IMAGES"("imagePath", "dateToShow") VALUES ($1, $2);',
    values: [imageName, new Date(date)],
  }
  try {
    client = await pool.connect()
    const res = await client.query(query);
    console.log('INSERT worked');
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

exports.getImages = async (imageName, date) => {
  let client;
  const query = {
    text: 'SELECT * FROM public."IMAGES" WHERE ',
    values: [imageName, new Date(date)],
  }
  try {
    client = await pool.connect()
    const res = await client.query(query);
    console.log('INSERT worked');
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}
