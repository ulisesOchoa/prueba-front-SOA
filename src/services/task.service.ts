import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_AUTH_DOMAIN;

class TaskService {
  getTasks() {
    return axios.get(API_URL + 'tasks', { headers: authHeader() });
  }

  storeTask(name: string, priority: string, description: string, assigned_to: string) {
	const taskData = {
		name: name,
		priority: priority,
		description: description,
		assigned_to: assigned_to
	};

    return axios.post(API_URL + 'tasks', taskData, { headers: authHeader() });
  }

  deleteTask(id:number) {
    return axios.delete(API_URL + `tasks/${id}`, { headers: authHeader() });
  }
}

export default new TaskService();