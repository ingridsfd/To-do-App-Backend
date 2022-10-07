import Express, { response } from "express";
import { getDBHandler } from "../db/index.js";

const ToDosRequestHandler = Express.Router();

ToDosRequestHandler.post("/to-dos", async (request, response) => {
  try {
    const { title, description, isDone: is_done } = request.body;
    const dbHandler = await getDBHandler();

    const newTodo = await dbHandler.run(`
        INSERT INTO todos (title, description, is_done)
        VALUES (
            '${title}',
            '${description}',
            ${is_done}
        )
    `);

    await dbHandler.close();

    response.send({ newTodo: { title, description, is_done, ...newTodo } });
  } catch (error) {
    response.status(500).send({
      error: `Something went wrong when trying to create a new to do`,
      errorInfo: error.message,
    });
  }
});

ToDosRequestHandler.get("/to-dos", async (request, response) => {
  try {
    const dbHandler = await getDBHandler();

    const todos = await dbHandler.all("SELECT * FROM todos");
    await dbHandler.close();

    if (!todos || !todos.length) {
      return response.status(404).send({ message: "To Dos Not Found" });
    }

    response.send({ todos });
  } catch (error) {
    response.status(500).send({
      error: `Something went wrong when trying to get the to dos`,
      errorInfo: error.message,
    });
  }
});

ToDosRequestHandler.delete("/to-dos/:id", async (request, response) => { //la ponemos asíncrona para que retorne algo con el tiempo
  try {
    const todoId = request.params.id;
    const dbHandler = await getDBHandler();

    const deletedTodo = await dbHandler.run(
      "DELETE FROM todos WHERE id = ?",
      todoId
    );

    await dbHandler.close();

    response.send({ todoRemoved: { ...deletedTodo } });
  } catch (error) {
    response.status(500).send({
      error: `Something went wrong when trying to delete the to do`,
      errorInfo: error.message,
    });
  }
});

//Challenge: realizar el update
ToDosRequestHandler.put("/to-dos", async (request, response) => {
  //redacta el try - catch
  try { // ¿Queremos actualizar todos los datos? Sí
    //Hay que indicarle de dónde a dónde en nuestra base de datos. Usa la referencia del post
    const dbHandler = await getDBHandler();
    const todos = await dbHandler.all("SELECT * FROM todos");
    await dbHandler.close();
    //Ahora, dile qué necesitamos a hacer con los datos: actualizarlos
    //¿cómo lo redactarías? primero que si el contenido de todos esos params deja de ser igual a sí mismo, que retorne un post vacío
    if (todos !== todos) {
      //return nuevo post vacío
      } else {
      return response.status(404).send({ message: "To Do not updated yet" });
    };

    response.send({ todos });
  } catch (error) {
    response.status(500).send({
      error: `Something went wrong when trying to get the to dos`,
      errorInfo: error.message,
    });
  }
});
    
export default ToDosRequestHandler; 
