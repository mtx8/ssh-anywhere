import type { ComponentType } from "react";

export interface ComponentDefinition {
    name: string;
    description: string;
    component: ComponentType<Record<string, unknown>>;
}

export const componentDefinitions: ComponentDefinition[] = [];

export default {
    components: componentDefinitions,
};
