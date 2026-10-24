export type ObjectType = 'apartment' | 'house' | 'plot';
export type GoalType = 'ready' | 'build' | 'repair';
export type FinanceType = 'rural' | 'standard' | 'own';

export type Tag = ObjectType | GoalType | FinanceType;

export interface ScenarioFilter {
  object: ObjectType;
  goal: GoalType;
  finance: FinanceType;
}

export interface PresetScenario extends ScenarioFilter {
  id: number;
  name: string;
}

export type Cond =
  | Tag
  | { and: Cond[] }
  | { or: Cond[] }
  | { not: Cond };

export interface Recommendation {
  text: string;
  link?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  condition?: Cond;
  checklist: string[];
  recommendation?: Recommendation;
  why: string;
  whyOverrides?: Partial<Record<Tag, string>>;
}

export interface RoadmapStage {
  id: string;
  title: string;
  goal: string;
  steps: RoadmapStep[];
}

export interface ResolvedRoadmapStep extends Omit<RoadmapStep, 'condition' | 'whyOverrides'> {
  resolvedWhy: string;
  activeOverrideTag?: Tag;
}

export interface ResolvedRoadmapStage extends Omit<RoadmapStage, 'steps'> {
  steps: ResolvedRoadmapStep[];
}