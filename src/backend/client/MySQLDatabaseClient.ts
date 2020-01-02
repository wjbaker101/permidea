import mysql from 'promise-mysql';

import secretProperties from '../../common/config-secret.json';

const mysqlProperties = secretProperties.database;

export const MySQLDatabaseClient = {
    async query(query: string, values?: any[]) {
        const connection = await mysql.createConnection(mysqlProperties);

        try {
            return connection.query({
                sql: query,
                values,
            });
        }
        catch (e) {
            return null;
        }
        finally {
            connection.end();
        }
    },
}
