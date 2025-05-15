import { EntityId } from "@/id-generator";
import { ActionEntityModel } from ".";

export class ActionEntityManager {
  models: { [id: EntityId]: ActionEntityModel } = {};
  constructor() {}
  register(model: ActionEntityModel) {
    if (model instanceof ActionEntityModel) this.models[model.id] = model;
  }

  unregister(id: EntityId) {
    this.models[id]?.cleanup({ softCleanup: true });
    delete this.models[id];
  }

  get() {
    return Object.values(this.models);
  }
}
