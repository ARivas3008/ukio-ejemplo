
import axios from 'axios';

export class ApiRequest {
    constructor(data) {
        this.data = data;
    }
}

export class ApiResponse {
    constructor(response) {
        this.data = response.data;
        this.status = response.status;
    }
}


export class Api {
    constructor(baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000') {
        console.log('API URL:', baseURL);

        this.client = axios.create({
            baseURL,
            timeout: 12000
        });
    }

    async request(method, url, data) {
        try {
            const response = await this.client.request({
                method,
                url,
                data
            });

            return new ApiResponse(response).data;
        } catch (error) {
            console.error('Error al conectar con la API:', {
                baseURL: this.client.defaults.baseURL,
                url,
                message: error.message,
                status: error.response?.status
            });
            throw error;
        }
    }
}


export class Endpoint {
    constructor(path, assembler, api = new Api()) {
        this.path = path;
        this.assembler = assembler;
        this.api = api;
    }

    async all() {
        const rows = await this.api.request('GET', this.path);
        return rows.map((row) => this.assembler.toEntity(row));
    }

    async create(entity) {
        return this.assembler.toEntity(
            await this.api.request('POST', this.path, this.assembler.toResource(entity))
        );
    }

    async patch(id, changes) {
        return this.assembler.toEntity(
            await this.api.request('PATCH', `${this.path}/${encodeURIComponent(id)}`, changes)
        );
    }

    async remove(id) {
        return this.api.request('DELETE', `${this.path}/${encodeURIComponent(id)}`);
    }
}
