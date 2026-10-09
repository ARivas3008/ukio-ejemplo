import{City} from "../model/city.entity.js";

export class CityAssembler {
    toEntity(resource){
        return new City(resource);
    }
    toResource(entity){
        const resource ={...entity};
        if (resource.id ==null) delete resource.id;
        return resource;
    }
}