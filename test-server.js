let http = require("http");
const { URL } = require("url");
const pool = require("./db.js");
http
  .createServer(async function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      response.writeHead(200);
      response.end();
      return;
    }
    let method = request.method;
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
    const path = parsedUrl.pathname;

    if (method === "GET" && path === "/organizations") {
      // getting data from db
      const result = await pool.query(
        "SELECT * FROM organizations ORDER BY created_at DESC"
      );
      // working with db to connect front
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ organizations: result.rows }));
    } else if (method === "POST" && path === "/organizations") {
      try {
        const body = await parseData(request);
        // working data from db
        const result = await pool.query(
          `INSERT INTO organizations (name, website, industries, stages, contact_email, contact_name, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            body.name,
            body.website,
            body.industries,
            body.stages,
            body.contactEmail,
            body.contactName,
            body.photoUrl,
          ]
        );
        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            receivedData: result.rows[0],
          })
        );
      } catch (err) {
        console.log("post err", err);
        response.end(
          JSON.stringify({
            error: "Server error",
            details: err.message,
          })
        );
      }
    } else if (method === "GET" && path === "/startups") {
      // getting data from db
      const result = await pool.query(
        "SELECT * FROM startups ORDER BY created_at DESC"
      );
      // working with db to connect front
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ startups: result.rows }));
    } else if (method === "POST" && path === "/startups") {
      try {
        const body = await parseData(request);
        // working data from db
        const result = await pool.query(
          `INSERT INTO startups (name, website, industries, stages, contact_email, contact_name, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            body.name,
            body.website,
            body.industries,
            body.stages,
            body.contactEmail,
            body.contactName,
            body.photoUrl,
          ]
        );
        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            receivedData: result.rows[0],
          })
        );
      } catch (err) {
        console.log("post err", err);
        response.end(
          JSON.stringify({
            error: "Server error",
            details: err.message,
          })
        );
      }
    } else {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Not Found" }));
    }
  })
  .listen(3000);

function parseData(request) {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => {
      // chunk= eto kusochek dati kotoraya idyot so storoni fronta
      data = data + chunk.toString();
      // chunk.toString(); => chunk po tipu stanovitsya string
    });
    request.on("end", () => {
      // kogda prishlo vsyo
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  });
}
