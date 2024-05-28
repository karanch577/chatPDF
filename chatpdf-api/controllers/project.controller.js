import pool from "../database/db.js"
import { Queue } from 'bullmq';
import CustomError from "../utils/customError.js"


export const addProject = async (req, res) => {

    const { title, description } = req.body;

    if(!title || !description) {
      throw new CustomError("title and description is required", 400)
    }
    const client = await pool.connect();

    // inserting data in the project table
    try {
        const result = await client.query(`
          INSERT INTO project (title, description, pdf_url)
          VALUES ($1, $2, $3)
          RETURNING id, title, description, pdf_url;
        `, [title, description, req?.file?.location]);

        // add to the queue to generate vector embeddings
        const embeddingQueue = new Queue("embedding", {
            connection: {
                host: "localhost",
                port: 6379
            }
        })
        await embeddingQueue.add(`projectId ${result?.rows[0]?.id}`, {
            pdf_url: result?.rows[0]?.pdf_url,
            id: result?.rows[0]?.id
        })

        return res.status(200).json({
            success: true,
            message: "Project created successfully",
            project: result?.rows[0]
        })
      } catch (error) {
        console.error('Error inserting data:', error);
   
      } finally {
        client.release();
      }

}

export const listProjects = async (req, res) => {
  const client = await pool.connect();

  try {
    // get all the project from db
    const projects = await client.query(`
    SELECT * FROM project ORDER BY created_at ASC;
    `)

    return res.status(200).json({
      success: true,
      projects: projects.rows
    })

  } catch (error) {
    console.log(`Error in listProducts ==>> ${error}`)
  } finally {
    client.release()
  }
}

export const getProjectDetails = async (req, res) => {
  const { id } = req.query;

  if(!id) {
    throw new CustomError("project Id is required", 400)
  }

  const client = await pool.connect();

  try {
    // get all the project from db
    const project = await client.query(`
    SELECT * FROM project WHERE id = $1;
    `, [id])

    return res.status(200).json({
      success: true,
      project: project.rows[0]
    })

  } catch (error) {
    console.log(`Error in listProducts ==>> ${error}`)
  } finally {
    client.release()
  }
}