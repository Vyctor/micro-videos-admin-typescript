import { Uuid } from "../../../../../category/domain/value-objects/uuid.vo";
import { Entity } from "../../../../domain/entity";
import { InMemoryRepository } from "../in-memory.repository";
import { NotFoundError } from "../../../../domain/errors/not-found.error";

type StubEntityConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructorProps) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it("should insert a new entity", async () => {
    const entity = new StubEntity({
      name: "Stub",
      price: 10,
    });

    await repository.insert(entity);

    const result = await repository.findById(entity.entity_id);
    const allEntities = await repository.findAll();

    expect(result).toEqual(entity);
    expect(allEntities).toEqual([entity]);
  });

  it("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        name: "Stub 1",
        price: 10,
      }),
      new StubEntity({
        name: "Stub 2",
        price: 20,
      }),
    ];

    await repository.bulkInsert(entities);

    const result = await repository.findAll();

    expect(result).toEqual(entities);
  });

  it("should return all entities", async () => {
    const entities = [
      new StubEntity({
        name: "Stub 1",
        price: 10,
      }),
      new StubEntity({
        name: "Stub 2",
        price: 20,
      }),
      new StubEntity({
        name: "Stub 3",
        price: 30,
      }),
    ];

    const entities2 = [
      new StubEntity({
        name: "Stub 4",
        price: 40,
      }),
      new StubEntity({
        name: "Stub 5",
        price: 50,
      }),
      new StubEntity({
        name: "Stub 6",
        price: 60,
      }),
    ];

    await repository.bulkInsert([...entities, ...entities2]);

    const result = await repository.findAll();

    expect(result).toEqual([...entities, ...entities2]);
    expect(result).toHaveLength(6);
  });

  it("should throw an error on update if entity does not exists", async () => {
    const entity = new StubEntity({
      name: "Stub",
      price: 10,
    });

    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({
      name: "Stub",
      price: 10,
    });

    await repository.insert(entity);

    const entity2 = new StubEntity({
      entity_id: entity.entity_id,
      name: "Stub 2",
      price: 20,
    });

    await repository.update(entity2);

    const result = await repository.findById(entity.entity_id);

    expect(result).toEqual(entity2);
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({
      name: "Stub",
      price: 10,
    });

    await repository.insert(entity);

    await repository.delete(entity.entity_id);

    const result = await repository.findById(entity.entity_id);

    expect(result).toBeNull();
  });

  it("should throw an error on delete if entity does not exists", async () => {
    const entity = new StubEntity({
      name: "Stub",
      price: 10,
    });

    await expect(repository.delete(entity.entity_id)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  it("should find an entity by id", async () => {
    const entity = new StubEntity({
      name: "Stub",
      price: 10,
    });

    await repository.insert(entity);

    const result = await repository.findById(entity.entity_id);

    expect(result).toEqual(entity);
  });

  it("should return null if entity does not exists", async () => {
    const result = await repository.findById(new Uuid());
    expect(result).toBeNull();
  });
});
