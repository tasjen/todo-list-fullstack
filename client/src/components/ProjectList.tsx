import { useUserDataQuery } from '../hooks';
import Project from './Project';

export default function ProjectList() {
  const { userData } = useUserDataQuery();
  return (
    <ul id="project-list" data-test="project-list">
      {userData?.projects.map((p) => <Project key={p.id} project={p} />)}
    </ul>
  );
}