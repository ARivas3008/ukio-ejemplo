import{Apartment} from "../model/apartment.entity.js";

export class ApartmentAssembler {
    toEntity(resource){
        return new Apartment(resource);
    }
    toResource(entity){
        const resource ={...entity};
        if (resource.id == null) delete resource.id;
        return resource;
    }
}