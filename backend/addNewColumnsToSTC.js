const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Path to your database
const dbPath = path.join(__dirname, "db", "db.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error connecting to database:", err);
    process.exit(1);
  }
  console.log("✅ Connected to database");
});

// Columns to add
const columnsToAdd = [
  { name: "marital_status", type: "TEXT" },
  { name: "blood_group", type: "TEXT" },
  { name: "previous_work_experience", type: "TEXT" },
  { name: "highest_degree", type: "TEXT" },
  { name: "stream_in_btech", type: "TEXT"},
  { name: "college", type: "TEXT" },
  { name: "database", type: "TEXT" },
  { name: "hobbies", type: "TEXT" },
  { name: "cultural_hobby", type: "TEXT" },
  { name: "achievement", type: "TEXT" },
];

console.log("\n🔧 Starting migration...\n");

let completed = 0;
let added = 0;
let alreadyExists = 0;
let errors = 0;

columnsToAdd.forEach((column, index) => {
  const sql = `ALTER TABLE stc_candidates ADD COLUMN ${column.name} ${column.type}`;
  
  db.run(sql, (err) => {
    completed++;
    
    if (err) {
      if (err.message.includes("duplicate column")) {
        console.log(`⚠️  ${column.name.padEnd(30)} - Already exists`);
        alreadyExists++;
      } else {
        console.error(`❌ ${column.name.padEnd(30)} - Error: ${err.message}`);
        errors++;
      }
    } else {
      console.log(`✅ ${column.name.padEnd(30)} - Added successfully`);
      added++;
    }
    
    // When all columns are processed
    if (completed === columnsToAdd.length) {
      console.log("\n" + "=".repeat(60));
      console.log("📊 MIGRATION SUMMARY");
      console.log("=".repeat(60));
      console.log(`✅ Successfully added:    ${added} columns`);
      console.log(`⚠️  Already existed:      ${alreadyExists} columns`);
      console.log(`❌ Errors:               ${errors} columns`);
      console.log("=".repeat(60));
      
      // Verify the schema
      db.all("PRAGMA table_info(stc_candidates)", [], (err, rows) => {
        if (err) {
          console.error("\n❌ Error verifying schema:", err);
        } else {
          console.log("\n📋 Current STC Candidates Table Schema:");
          console.log("=".repeat(60));
          rows.forEach((row) => {
            const mark = columnsToAdd.some(col => col.name === row.name) ? "🆕" : "  ";
            console.log(`${mark} ${row.cid.toString().padStart(2)}. ${row.name.padEnd(35)} ${row.type}`);
          });
          console.log("=".repeat(60));
        }
        
        db.close((err) => {
          if (err) {
            console.error("\n❌ Error closing database:", err);
          } else {
            console.log("\n✅ Database connection closed");
            console.log("\n🎉 Migration completed! Please restart your backend server.\n");
          }
        });
      });
    }
  });
});