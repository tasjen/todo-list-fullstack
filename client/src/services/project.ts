import axios from 'axios';
import { getAuthHeader, getToken } from './util';
import { ProjectState } from '../types';

const baseUrl = '/api/projects';

const create = async (projectObject: {
  name: string;
}): Promise<ProjectState> => {
  const res = await axios.post(
    baseUrl,
    projectObject,
    getAuthHeader(getToken())
  );
  delete res.data.user;
  return res.data;
};

export default {
  create,
};