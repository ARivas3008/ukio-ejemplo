import { Endpoint } from '../../shared/services/api.js';
import { ApartmentAssembler } from './apartment.assembler.js';

export class ApartmentService extends Endpoint {
    constructor(api) {
        super(import.meta.env?.VITE_APARTMENTS_PATH || '/apartments', new ApartmentAssembler(), api);
    }
}