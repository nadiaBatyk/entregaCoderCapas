
const { normalize, schema } = require("normalizr");
function normalizar (data) {
    //console.log('SOY LA DATAAA',data);
  
    const schemaAuthor = new schema.Entity(
      "author",
      {},
      { idAttribute: "email" }
    );
    const schemaMensaje = new schema.Entity(
      "mensaje",
      {
        author: schemaAuthor,
      },
      { idAttribute: "_id" }
    );
    const mensajesSchema = new schema.Entity("mensajes", {
      mensajes: [schemaMensaje],
    });
    const dataSinNormalizar = { id: "mensajes", mensajes: data };
    return normalize(dataSinNormalizar, mensajesSchema);
  };
  
module.exports = normalizar;