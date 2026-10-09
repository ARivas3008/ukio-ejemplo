export class Apartment {
    constructor(resource={}){
        this.id = resource.id ?? null;
        this.apartmentId = resource.apartmentId ?? null;
        this.cityId = resource.cityId ?? null;
        this.name = resource.name ?? null;
        this.description = resource.description ?? null;
        this.numberBedrooms = resource.numberBedrooms ?? null;
        this.numberGarage = resource.numberGarage ?? null;
        this.price = resource.price ?? null;
        this.squareMeters = resource.squareMeters ?? null;
        this.startDate = resource.startDate ?? null;
        this.endDate = resource.endDate ?? null;
        this.state = resource.state ?? null;
        Object.assign(this, resource);
    }
}
