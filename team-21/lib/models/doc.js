// Switch to database
use("codeforchange");

// ---------------- DOCUMENTS COLLECTION ----------------
db.createCollection("documents", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "document_type", "document_name", "file_url"],
      properties: {
        user_id: { bsonType: "objectId" },
        document_type: {
          enum: ["Resume", "Offer Letter", "Certificate", "ID Proof", "Others"]
        },
        document_name: {
          bsonType: "string",
          pattern: "\\.(pdf|jpg|jpeg|png|docx)$"
        },
        file_url: { bsonType: "string" },
        uploaded_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        verified: { bsonType: "bool" },
        remarks: { bsonType: "string" },
        verified_by: { bsonType: ["objectId", "null"] },
        version: { bsonType: "int", minimum: 1 }
      }
    }
  }
});