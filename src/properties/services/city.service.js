import { Endpoint } from '../../shared/services/api.js';
import { CityAssembler } from './city.assembler.js';

export class CityService extends Endpoint {
    constructor(api) {
        super(import.meta.env?.VITE_CITIES_PATH || '/cities', new CityAssembler(), api);
    }
}
