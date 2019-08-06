import { Command } from './Command';
import { logError } from './error';
import { tqGet } from './tqGet';
import { IResourceList } from './ResourceList';

export interface IMilestoneResource {
  id: number;
  created_by: number;
  created_at: Date;
  updated_by: number;
  updated_at: Date;
  epoch: number;
  name: string;
  description: string;
  client_id: number;
  project_id: number;
  start_date: Date;
  release_date: Date;
  is_complete: boolean;
  sequence: number;
  requirement_reference_id: string;
  virtual: any;
  metadata_model: string;
}

export class MilestoneCommand extends Command {
  constructor() {
    super(
      'milestones',
      'List milestones in project.',
      args => {
        return args;
      },
      args => {
        this.auth.update(args).then(
          accessToken => {
            if (!this.auth.projectId) {
              logError(
                'Project is required. Try adding "--project_name=<name>" or "--project_id=<number>"'
              );
            } else {
              tqGet<IResourceList<IMilestoneResource>>(
                accessToken,
                `/milestone?project_id=${this.auth.projectId}`
              ).then(
                milestoneList => {
                  console.log(
                    milestoneList.data.map(p => {
                      return { id: p.id, name: p.name };
                    })
                  );
                },
                error => logError(error)
              );
            }
          },
          error => logError(error)
        );
      }
    );
  }
}
