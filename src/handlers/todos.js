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
ToDosRequestHandler.patch("/to-dosU", async (request, response) => {
  //redacta el try - catch
  try { 
    const changes = request.body; //el usuario hará cambios desde el body
    const dbHandler = await getDBHandler();
    //estos son los inputs del usuario en la base de datos
    const newTodo = await dbHandler.run(`
        INSERT INTO todos (title, description, is_done)
        VALUES (
            '${title}',
            '${description}',
            ${is_done}
        )
    `);
    const todos = await dbHandler.all("SELECT * FROM todos"); //selecciona todos los inputs de las columnas existentes
    const found = todos.find(todos => todos === newTodo); //ubica y registra todo los cambios de los usuarios en los todos
    //Aquí intercambia unos datos por otros:
    if (found) {
      Object.assign(found, changes)
      response.status(200).json(found)
    } else {
      return response.status(404).send({ message: "Not able to make changes" });
    };
    //Aquí enviamos el dato para ver
    response.send({ todos });
  } catch (error) {
    response.status(500).send({
      error: `Something went wrong when trying to update the to dos`,
      errorInfo: error.message,
    });
  }
});
    
export default ToDosRequestHandler; 
