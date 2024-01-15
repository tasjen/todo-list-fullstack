import { Request, Response } from 'express';
import Project from '../models/project_model';
import { parseProject, parseProjectForUpdate } from '../utils/validator';

const getAllProjects = async (_req: Request, res: Response): Promise<void> => {
  const allProjects = await Project.find({})
    .populate({
      path: 'user',
      select: 'username',
    })
    .populate({
      path: 'tasks',
      select: ['name', 'description', 'due_date', 'priority'],
    });
  res.status(200).json(allProjects);
};

const addProject = async (req: Request, res: Response): Promise<void> => {
  const newProject = await parseProject(req.body, req.user as string);
  const docProject = new Project(newProject);
  const savedProject = await docProject.save();

  res.status(201).json(
    await savedProject.populate({
      path: 'tasks',
      select: ['name', 'description', 'due_date', 'priority'],
    })
  );
};

const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const project = await Project.findById(req.params.id);
  if (project !== null && project.toJSON().user.toString() === req.user) {
    void project.deleteOne();
  }
  res.status(201).end();
};

const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { name, id } = await parseProjectForUpdate(
    req.body,
    req.user as string
  );

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true, context: 'query' }
  );

  res.status(201).json(updatedProject);
};

export default {
  getAllProjects,
  addProject,
  deleteProject,
  updateProject,
};
