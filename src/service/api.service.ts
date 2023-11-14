import { promises } from "node:dns";

const apiUrl = 'http://localhost:3000';

const apiService = {

  async register(data: object) {
    return await this.postHttp(apiUrl+'/user', data);
  },

  async login(data: object) {
    return await this.postHttp(apiUrl+'/auth/login', data);
  },

  async postHttp(url: string, data: object) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adicione outros cabeçalhos, se necessário
      },
      body: JSON.stringify(data),
    };

    return new Promise((resolve, reject) => {
      fetch(url, requestOptions).then(response => {
        if (!(response.status === 200 || response.status === 201)) {
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
