import { useState, useEffect, useRef } from 'react';
import userService from './services/user';
import { NewTask, TaskJson, initProjectState, initUserState } from './types';
import LogInForm from './components/LogInForm';
import Project from './components/Project';
import Togglable from './components/Togglable';
import ProjectForm from './components/ProjectForm';
import projectService from './services/project';
import TaskForm from './components/TaskForm';
import taskService from './services/task';
import { isAxiosError } from 'axios';
import Task from './components/Task';

const App = () => {
  const [userData, setUserData] = useState(initUserState);
  const [workingProject, setWorkingProject] = useState(initProjectState);

  const projectFormRef = useRef({
    turnOffVisible: () => {},
    turnOnVisible: () => {},
  });
  const taskFormRef = useRef({
    turnOffVisible: () => {},
    turnOnVisible: () => {},
  });

  const taskFormEditRef = useRef({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setTaskFormEdit: (_taskObject: Omit<TaskJson, 'project'>) => {},
    clearForms: () => {},
  });

  const projectFormEditRef = useRef({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setProjectFormEdit: (_projectObject: { name: string; id: string }) => {},
    clearForms: () => {},
  });

  const fetchUserData = async () => {
    try {
      const userData = await userService.getUserData();
      setUserData(userData);
      setWorkingProject(userData.projects[0]);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const clearUserData = () => {
    localStorage.clear();
    setUserData(initUserState);
    setWorkingProject(initProjectState);
  };

  const handleLogOut = () => {
    clearUserData();
  };

  const addProject = async (projectObject: { name: string }) => {
    try {
      const newProject = await projectService.create(projectObject);
      setUserData({
        ...userData,
        projects: [...userData.projects, newProject],
      });
      setWorkingProject(newProject);
      hideAllForms();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const removeProject = (projectId: string) => {
    try {
      projectService.remove(projectId);
      setUserData({
        ...userData,
        projects: userData.projects.filter((e) => e.id !== projectId),
      });
      setWorkingProject(userData.projects.find((p) => p.name === 'Default')!);
      hideAllForms();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const updateProject = async (projectObject: { name: string; id: string }) => {
    try {
      const updatedProject = await projectService.update(projectObject);

      const updatedWorkingProject = {
        ...workingProject,
        name: updatedProject.name,
      };

      setUserData({
        ...userData,
        projects: userData.projects.map((p) =>
          p.id !== workingProject.id ? p : updatedWorkingProject
        ),
      });
      setWorkingProject(updatedWorkingProject);
      hideAllForms();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const addTask = async (taskObject: NewTask) => {
    try {
      const newTask = await taskService.create(taskObject);
      setWorkingProject({
        ...workingProject,
        tasks: [...workingProject.tasks, newTask],
      });
      setUserData({
        ...userData,
        projects: userData.projects.map((p) =>
          p.id !== workingProject.id
            ? p
            : { ...p, tasks: [...p.tasks, newTask] }
        ),
      });
      hideAllForms();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const removeTask = (taskId: string) => {
    try {
      taskService.remove(taskId);

      const updatedWorkingProject = {
        ...workingProject,
        tasks: workingProject.tasks.filter((t) => t.id !== taskId),
      };

      setUserData({
        ...userData,
        projects: userData.projects.map((p) =>
          p.id !== workingProject.id ? p : updatedWorkingProject
        ),
      });
      setWorkingProject(updatedWorkingProject);
      hideAllForms();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const updateTask = async (taskObject: TaskJson) => {
    try {
      const updatedTask = await taskService.update(taskObject);

      const updatedWorkingProject = {
        ...workingProject,
        tasks: workingProject.tasks.map((t) =>
          t.id !== updatedTask.id ? t : updatedTask
        ),
      };

      setUserData({
        ...userData,
        projects: userData.projects.map((p) =>
          p.id !== workingProject.id ? p : updatedWorkingProject
        ),
      });
      setWorkingProject(updatedWorkingProject);
      hideAllForms();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const hideAllForms = () => {
    taskFormRef.current.turnOffVisible();
    projectFormRef.current.turnOffVisible();
    taskFormEditRef.current.clearForms();
    projectFormEditRef.current.clearForms();
  };

  const showProjectForm = () => {
    projectFormRef.current.turnOnVisible();
  };

  const hideProjectForm = () => {
    projectFormRef.current.turnOffVisible();
  };

  const showTaskForm = () => {
    taskFormRef.current.turnOnVisible();
  };

  const hideTaskForm = () => {
    taskFormRef.current.turnOffVisible();
  };

  const setTaskFormEdit = (taskObject: Omit<TaskJson, 'project'>) => {
    taskFormEditRef.current.setTaskFormEdit(taskObject);
  };

  const setProjectFormEdit = (projectObject: { name: string; id: string }) => {
    projectFormEditRef.current.setProjectFormEdit(projectObject);
  };

  useEffect(() => {
    if (localStorage.getItem('loggedUser') !== null) {
      fetchUserData();
    }
  }, []);

  if (
    localStorage.getItem('loggedUser') !== null &&
    userData === initUserState
  ) {
    return <></>;
  }

  return userData === initUserState ? (
    <LogInForm fetchUserData={fetchUserData} />
  ) : (
    <>
      <header>
        <p>Todo List</p>
        <button id="logout-button" onClick={handleLogOut}>
          log out
        </button>
      </header>
      <main>
        <nav>
          <ul id="menu-list">
            <li id="all-task" className="menu">
              All tasks
            </li>
            <li id="today-task" className="menu">
              Today
            </li>
            <li id="this-week-task" className="menu">
              This week
            </li>
          </ul>
          <p id="project-header">Projects</p>
          <ul id="project-list">
            {userData.projects.map((p) => (
              <Project
                key={p.id}
                project={p}
                handleProjectSwitch={setWorkingProject}
                workingProject={workingProject}
                removeProject={removeProject}
                hideAllForms={hideAllForms}
                setProjectFormEdit={setProjectFormEdit}
              />
            ))}
          </ul>
          <div id="project-adder">
            <Togglable buttonLabel={'+ Add project'} ref={projectFormRef}>
              <ProjectForm
                addProject={addProject}
                updateProject={updateProject}
                showProjectForm={showProjectForm}
                hideProjectForm={hideProjectForm}
                ref={projectFormEditRef}
              />
            </Togglable>
          </div>
        </nav>
        <div id="main-section">
          <p id="tab-name">{workingProject.name}</p>
          <ul id="task-list">
            {workingProject.tasks.length === 0 ? (
              <p>No tasks here.</p>
            ) : (
              workingProject.tasks
                .sort(
                  (a, b) =>
                    new Date(a.due_date).getTime() -
                    new Date(b.due_date).getTime()
                )
                .map((t) => (
                  <Task
                    key={t.id}
                    task={t}
                    removeTask={removeTask}
                    setTaskFormEdit={setTaskFormEdit}
                  />
                ))
            )}
          </ul>
          <div id="task-adder">
            <Togglable buttonLabel={'+ Add task'} ref={taskFormRef}>
              <TaskForm
                addTask={addTask}
                updateTask={updateTask}
                project={workingProject.id}
                hideTaskForm={hideTaskForm}
                showTaskForm={showTaskForm}
                ref={taskFormEditRef}
              />
            </Togglable>
          </div>
        </div>
      </main>
      <footer>
        <a href="https://github.com/tasjen/todo-list-fullstack">
          <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" />
        </a>
      </footer>
    </>
  );
};

export default App;
