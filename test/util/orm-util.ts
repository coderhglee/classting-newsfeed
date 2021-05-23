import { getConnection } from 'typeorm';

export const resetEntity = async () => {
  const connection = getConnection();
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName};`);
  }
};
