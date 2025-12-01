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
    } // GET найти 3 подходящих стартапа для инвестора
    else if (method === "GET" && path.match(/^\/matches\/\d+$/)) {
      const investorId = path.split("/")[2];

      try {
        const investorResult = await pool.query(
          "SELECT id, name, industries, stages FROM organizations WHERE id = $1",
          [investorId]
        );

        if (investorResult.rows.length === 0) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ error: "Investor not found" }));
          return;
        }

        const investor = investorResult.rows[0];
        // checking for empty/none
        const investorIndustries = Array.isArray(investor.industries)
          ? investor.industries
          : [];
        const investorStages = Array.isArray(investor.stages)
          ? investor.stages
          : [];

        // matching
        const matchesResult = await pool.query(
          `SELECT id, name, website, industries, stages, contact_name, contact_email, meeting_count,(
          (SELECT COUNT(*) FROM unnest(industries) AS i WHERE i = ANY($1::text[])) +
          (SELECT COUNT(*) FROM unnest(stages) AS s WHERE s = ANY($2::text[]))) AS match_score 
          FROM startups 
          WHERE industries && $1::text[] OR stages && $2::text[] ORDER BY match_score DESC, meeting_count ASC LIMIT 3`,
          [investor.industries || [], investor.stages || []]
        );
        let matches = investorResult.rows;
        if (matches.length < 3) {
          const neededCount = 3 - matches.length;
          // if not matched show random
          const fallbackResult = await pool.query(
            `SELECT id, name, website, industries, stages, contact_name, contact_email, meeting_count
                FROM startups 
                WHERE meeting_count = 0 
                AND id != ALL(ARRAY[$3::int[]]) -- Исключаем стартапы, которые уже нашли
                ORDER BY RANDOM() 
                LIMIT $1`,
            [neededCount, neededCount, matches.map((m) => m.id)]
          );

          matches = matches.concat(fallbackResult.rows);
        }

        // +1 meeting_count
        if (matchesResult.rows.length > 0) {
          const startupIds = matchesResult.rows.map((s) => s.id);
          await pool.query(
            "UPDATE startups SET meeting_count = meeting_count + 1 WHERE id = ANY($1)",
            [startupIds]
          );
        }

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            investor: {
              id: investor.id,
              name: investor.name,
              industries: investor.industries,
              stages: investor.stages,
            },
            matches: matchesResult.rows,
          })
        );
      } catch (err) {
        console.error("❌ Matches Error:", err);
        response.writeHead(500, { "Content-Type": "application/json" });
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
