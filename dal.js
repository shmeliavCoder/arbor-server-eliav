const { Pool, Client } = require("pg");

let pool

exports.initPool = () => {
  try {
    pool = new Pool({
      user: "postgres",
      //host: "172.21.128.3", // internal
      host: "34.79.249.65", // external
      port: "5432",
      // host: "/cloudsql/bamboo-volt-333817:europe-west1:arbor-yuval", // </.s.PGSQL.5432>
      database: "postgres",
      password: "fx2qGG1ctyy78uaD",
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
  let res
  const query = {
    text: 'SELECT "imagePath", "dateToShow" FROM "IMAGES" WHERE "dateToShow" = (SELECT max("dateToShow") FROM "IMAGES" b WHERE b."dateToShow" < CURRENT_TIMESTAMP)',
    values: [],
  }
  try {
    client = await pool.connect()
    res = await client.query(query);
    console.log('image', res?.rows?.[0]);
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }

  return res.rows[0]
}
