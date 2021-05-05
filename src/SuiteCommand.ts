import { Command } from './Command';
import { logError } from './logError';
import { tqRequest } from './tqRequest';
import { ResourceList } from './gen/models/ResourceList';
import { SuiteApi } from './gen/domain/suite/SuiteApi';

export class SuiteCommand extends Command {
  constructor() {
    super(
      'suites',
      'List suites in project.',
      (args) => {
        return args
          .option('revision_log', {
            alias: 'rl',
            describe: 'Get history',
            type: 'boolean',
            default: false,
            boolean: true,
          })
          .option('delete', {
            alias: 'dl',
            describe: 'delete a suite',
            type: 'boolean',
            default: false,
            boolean: true,
          })
          .option('suite_id', {
            alias: 'si',
            describe: 'Suite to delete',
            type: 'string',
          })
          .option('params', {
            alias: 'p',
            describe: 'Add Properties',
            type: 'array',
          });
      },
      (args) => {
        this.auth.update(args).then(async () => {
          const params = args.params ? (args.params as string[]).join('&') : '';
          const revisionLog = args.revision_log
            ? '?revision_log=true' + (args.params ? '&' + params : '')
            : args.params
            ? '?' + params
            : '';
          if (!args.delete) {
            const url =
              (args.plan_id ? `/plan/${args.plan_id}` : '') +
              `/suite${revisionLog}`;
            console.log(url);

            tqRequest<ResourceList<SuiteApi>>(url).then(
              (list) => {
                if (args.revision_log) {
                  console.log(list);
                } else {
                  if (list.total > 0) {
                    console.log(
                      list.data.map((p) => {
                        return { id: p.id, key: p.key, name: p.name };
                      })
                    );
                  } else {
                    console.log('Result is empty');
                  }
                }
              },
              (error) => logError(error)
            );
          } else {
            try {
              const suiteId = args.suite_id;
              if (!suiteId) {
                logError(
                  'Suite id is required to perform delete, try adding --suite_id=<number>'
                );
              }
              const url =
                (args.plan_id ? `/plan/${args.plan_id}` : '') +
                `/suite/${suiteId}`;
              console.log(url);

              const result = await tqRequest<ResourceList<SuiteApi>>(
                url,
                'DELETE'
              );
              console.log('Delete Success ', result);
            } catch (error) {
              logError(error);
            }
          }
        });
      }
    );
  }
}
