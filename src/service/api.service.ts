import { Task } from './../types/task';
import {useAppStore} from '../store/app';
const globalStore = useAppStore()
const apiUrl = 'http://localhost:3000';

const apiService = {

  async createTask(data: Task) {
    return await this.postHttp(apiUrl+'/task', data, true);
  },

  async getTasks() {
    return await this.getHttp(apiUrl+'/task');
  },

  async updateTask(taskId: number, data: object) {
    return await this.putHttp(apiUrl+'/task/'+taskId, data);
  },

  async updateOrder(data: object) {
    return await this.patchHttp(apiUrl+'/task/order', data);
  },

  async register(data: object) {
    return await this.postHttp(apiUrl+'/user', data, false);
  },

  async login(data: object) {
    return await this.postHttp(apiUrl+'/auth/login', data, false);
  },

  async postHttp(url: string, data: object, token: boolean) {
    let requestOptions = {};
    if (token) {
      requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ globalStore.user.access_token,
        },
        body: JSON.stringify(data),
      }
    } else {
      {
        requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      }
    }

    return new Promise((resolve, reject) => {
      fetch(url, requestOptions).then(response => {
        if (!(response.status === 200 || response.status === 201 || response.status === 202)) {
          console.error(`Request Error \n  HTTP STATUS: ${response.status} \n RESPONSE: ${response}`);
          reject(`Request Error \n  HTTP STATUS: ${response.status} \n RESPONSE: ${response}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('Erro ao obter dados:', error.message);
        reject(error);
      });
    })
  },

  async getHttp(url: string) {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ globalStore.user.access_token,
      }
    };

    return new Promise((resolve, reject ) => {
      fetch(url, requestOptions).then(response => {
        if (!(response.status === 200 || response.status === 201 || response.status === 202)) {
          console.error(`Request Error \n  HTTP STATUS: ${response.status} \n RESPONSE: ${response}`);
          reject(`Request Error \n  HTTP STATUS: ${response.status} \n RESPONSE: ${response}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('Erro ao obter dados:', error.message);
        reject(error);
      });
    })
  },

  async patchHttp(url: string, data: object) {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ globalStore.user.access_token,
      },
      body: JSON.stringify(data),
    }


    return new Promise((resolve, reject) => {
      fetch(url, requestOptions).then(response => {
        if (!(response.status === 200 || response.status === 201  || response.status === 202)) {
          console.error(`Request Error \n  HTTP STATUS: ${response.status} \n RESPONSE: ${response}`);
          reject(`Request Error \n  HTTP STATUS: ${response.status} \n RESPONSE: ${response}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('Erro ao obter dados:', error.message);
        reject(error);
      });
    })
  },

  async putHttp(url: string, data: object) {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ globalStore.user.access_token,
      },
      body: JSON.stringify(data),
    }


    return new Promise((resolve, reject) => {
      fetch(url, requestOptions).then(response => {
        if (!(response.status === 200 || response.status === 201  || response.status === 202)) {
          console.error(`Request Error \n  HTTP STATUS: ${response.status} \n RESPONSE: ${response}`);
          reject(`Request Error \n  HTTP STATUS: ${response.status} \n RESPONSE: ${response}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('Erro ao obter dados:', error.message);
        reject(error);
      });
    })
  },

};

export default apiService;
