
import { config } from '../../config.js';
import { CityService } from './city.service.js';
import { ApartmentService } from './apartment.service.js';

const same = (a, b) => String(a) === String(b);
const find = (rows, id) => rows.find((row) => same(row.id, id));
const sum = (rows, key) => rows.reduce((total, row) => total + Number(row[key] || 0), 0);
const percent = (part, total) => (total ? (part * 100) / total : 0);
const card = (title, content = {}, stats = {}, footer = {}) => ({ title, content, stats, footer });
const now = () => new Date().toISOString();
const required = (value) => value !== null && value !== undefined && String(value).trim() !== '';

const day = (value) => {
    const d = new Date(value);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const hours = (value) =>
    Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 3600000));

const fail = (message) => {
    throw new Error(message);
};

/** Coordinates domain operations and enforces business invariants. */
export class WorkspaceService {
    constructor(repositories) {
        this.repositories = repositories || {
            cities: new CityService(),
            apartments: new ApartmentService(),
        };
    }

    async load() {
        const entries = await Promise.all(
            Object.entries(this.repositories).map(async ([key, repository]) => [
                key,
                await repository.all(),
            ])
        );
        return Object.fromEntries(entries);
    }

    summarize(data) {
        return data.cities.map((city) =>
            card(
                city.cityName,
                {
                    Description: city.description,
                    Population: city.population
                },
                {
                    'Quantity of Apartment': data.apartments.filter((row) =>
                        same(row.cityId, city.cityId ?? city.id)
                    ).length,
                }
            )
        );
    }

    items(data) {
        return data.apartments.map((row) => ({
            id: row.id,
            title: row.name ?? `Apartment ${row.apartmentId}`,
            content: {
                Description: row.description,
                'Number Parking': row.numberParking ?? row.numberGarage,
                'Number Bedroom': row.numberBedroom ?? row.numberBedrooms,
                Price: row.Price ?? row.price,
            },
            disabled: row.state === 'C',
        }));
    }

    async submit(form) {
        if (!form.startDate || !form.endDate)
            fail('Completing the quantity field is mandatory');

        const start = new Date(form.startDate);
        const end = new Date(form.endDate);

        if (
            !Number.isFinite(start.getTime()) ||
            !Number.isFinite(end.getTime()) ||
            end <= start
        ) {
            fail('End Date must be after Start Date');
        }

        const data = await this.load();
        const apartment = find(data.apartments, form.itemId);

        if (!apartment)
            fail('Related record not found');

        if (apartment.state === 'C')
            fail('Apartment already rented');

        await this.repositories.apartments.patch(apartment.id, {
            description: form.description || apartment.description,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            state: 'C',
        });

        return {
            close: true,
            details: {
                'Apartment Id': apartment.apartmentId,
                'Start Date': start.toISOString(),
                'End Date': end.toISOString(),
            },
        };
    }
}
