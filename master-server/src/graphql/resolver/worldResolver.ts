import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import {
    addWorld,
    getMaxWorldPort,
    getWorldList,
} from 'src/database/service/world.service';
import netState from 'node-netstat';
import { exec } from 'child_process';

const worldResolver: IResolvers = {
    Query: {
        async worldList(): Promise<Array<object>> {
            const result = await getWorldList();
            if (
                result.status == STATUS_CODE.SUCCESS &&
                result.worldArr !== undefined
            )
                return result.worldArr;
            else throw new Error(result.err);
        },
    },
    Mutation: {
        async createWorld(
            _: void,
            args: { uid: number; name: string },
        ): Promise<boolean> {
            const result = await getMaxWorldPort();
            console.log('getmaxWorld: ', result);
            if (result.status === STATUS_CODE.FAIL) return false;

            const worldsPort = result.maxWorldPort!;
            const maxPort = getEnablePort(worldsPort);
            exec(
                `PORT=${maxPort} docker-compose -f ../worker-server/docker-compose.yml -p ${args.name} up -d`,
                function (error: any, stdout: any, stderr: any) {
                    console.log(error);
                    console.log(stdout);
                    console.log(stderr);
                    // work with result
                },
            );

            console.log('getmaxWorld: ', result);

            const dbResult = await addWorld(
                args.uid,
                args.name,
                maxPort!,
                '/assets/world-park',
            );

            console.log('dbResult: ', dbResult);

            if (dbResult.status === STATUS_CODE.SUCCESS) return true;
            else return false;
        },
    },
};

const getEnablePort = (port: number) => {
    let maxPort = port;

    while (maxPort < 65536) {
        maxPort += 1;
        let result = true;
        netState(
            {
                sync: true,
                filter: { local: { port: maxPort } },
            },
            function (data) {
                result = false;
            },
        );

        if (result) return maxPort;
    }
};

export default worldResolver;
