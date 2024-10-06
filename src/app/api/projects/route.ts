// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;

export async function GET(request: NextRequest) {
  const client = new MongoClient(uri);
  const id = request.nextUrl.searchParams.get("id");
  const memberId = request.nextUrl.searchParams.get("memberId");
  const managerId = request.nextUrl.searchParams.get("managerId");

  try {
    await client.connect();
    const db = client.db("management-system");
    const projectsCollection = db.collection("projects");

    let projects;

    if (id) {
      // Obtener un proyecto específico por su ID
      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
      if (!project) {
        console.log("No se encontró el proyecto con el ID especificado:", id);
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json(project);
    } else if (memberId) {
      // Obtener proyectos para el miembro especificado
      console.log("Obteniendo proyectos para el miembro con ID:", memberId);
      projects = await projectsCollection.find({ members: { $in: [memberId] } }).toArray();

      console.log("Proyectos encontrados para el miembro:", projects);
    } else if (managerId) {
      // Obtener todos los proyectos por project manager
      projects = await projectsCollection.find({
        managerId
      }).toArray();
    } else {
      // Obtener todos los proyectos
      projects = await projectsCollection.find().toArray();
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  const client = new MongoClient(uri);
  
  try {
    const newProject = await request.json();
    await client.connect();
    const db = client.db("management-system");
    const projectsCollection = db.collection("projects");

    const projectToInsert = {
      ...newProject,
      status: newProject.status || "Iniciado",
      members: newProject.members || [],
      tasks: newProject.tasks || [],
      comments: newProject.comments || [],
      managerId: newProject.memberId || null,
    };

    const result = await projectsCollection.insertOne(projectToInsert);
    return NextResponse.json({ _id: result.insertedId, ...projectToInsert }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request: NextRequest) {
  const client = new MongoClient(uri);
  try {
    const { id, task, comment, updateTask, deleteTaskIndex, ...updateData } = await request.json();
    await client.connect();
    const db = client.db("management-system");
    const projectsCollection = db.collection("projects");

    if (task) {
      // Añadir una nueva tarea y añadir al miembro asignado al array de members si no está presente
      await projectsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { tasks: task }, $addToSet: { members: task.assignedTo } }
      );
    } else if (comment) {
      // Añadir un nuevo comentario
      await projectsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { comments: comment } }
      );
    } else if (updateTask) {
      // Actualizar una tarea específica
      const { taskIndex, updatedTask } = updateTask;
      const updateQuery = {
        $set: {
          [`tasks.${taskIndex}`]: updatedTask,
        },
      };
      await projectsCollection.updateOne({ _id: new ObjectId(id) }, updateQuery);
    } else if (typeof deleteTaskIndex === "number") {
      // Eliminar una tarea específica sin dejar null
      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
      if (project && Array.isArray(project.tasks)) {
        // Filtrar las tareas para eliminar la tarea en el índice especificado
        const filteredTasks = project.tasks.filter((_, index) => index !== deleteTaskIndex);

        // Actualizar el documento con las tareas filtradas
        await projectsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { tasks: filteredTasks } }
        );
      }
    } else {
      // Actualizar otros campos del proyecto
      await projectsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    }

    return NextResponse.json({ message: "Proyecto actualizado" });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request: NextRequest) {
  const client = new MongoClient(uri);
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("management-system");
    const projectsCollection = db.collection("projects");
    await projectsCollection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Proyecto eliminado" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  } finally {
    await client.close();
  }
}
