const { Pool, Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "34.79.249.65",
  database: "postgres",
  password: "fx2qGG1ctyy78uaD",
  port: "5432"
});

exports.insertImage = async (imageName, date) => {
    const query = {
        text: 'INSERT INTO public."IMAGES"("imagePath", "dateToShow") VALUES ($1, $2);',
        values: [imageName, new Date(date)],
      }
    try {
        const res = await client.query(query);
        console.log('INSERT worked');
    } catch (err) {
        console.log(err.stack);
    } finally {
        client.close();
    }
}

exports.getImages = (imageName, date) => {
  const query = {
      text: 'SELECT * FROM public."IMAGES" WHERE ',
      values: [imageName, new Date(date)],
    }
    try {
      const res = await client.query(query);
      console.log('INSERT worked');
  } catch (err) {
      console.log(err.stack);
  } finally {
      client.close();
  }
}
