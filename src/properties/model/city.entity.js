export class City {
    constructor(resource={}) {
        this.id = resource.id ?? null;
        this.cityId = resource.cityId ?? null;
        this.cityName = resource.cityName ?? null;
        this.country = resource.country?? null;
        this.population = resource.population?? null;
        this.description = resource.description ?? null;
        Object.assign(this, resource);
    }
}
