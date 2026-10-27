import { useMemo } from 'react';
import type {
  Cond,
  GoalType,
  FinanceType,
  ObjectType,
  RoadmapStage,
  ResolvedRoadmapStage,
  ResolvedRoadmapStep,
  ScenarioFilter,
  Tag,
} from '../types/navigator';

export function evaluateCond(cond: Cond | undefined, activeTags: Set<Tag>): boolean {
  if (!cond) return true;
  if (typeof cond === 'string') {
    return activeTags.has(cond);
  }
  if ('and' in cond) {
    return cond.and.every((c) => evaluateCond(c, activeTags));
  }
  if ('or' in cond) {
    return cond.or.some((c) => evaluateCond(c, activeTags));
  }
  if ('not' in cond) {
    return !evaluateCond(cond.not, activeTags);
  }
  return true;
}

export function getGoalBlockReason(object: ObjectType, goal: GoalType): string | null {
  if (object === 'plot' && goal === 'repair') return 'Для участка ремонт неприменим';
  if (object === 'apartment' && goal === 'build') return 'Строительство возможно только для дома или участка';
  return null;
}

export function getFinanceBlockReason(
  object: ObjectType,
  goal: GoalType,
  finance: FinanceType
): string | null {
  if (goal === 'repair' && finance !== 'own') return 'На ремонт ипотека не предусмотрена — только свои средства';
  if (finance === 'rural' && object !== 'house') return 'Сельская ипотека в навигаторе доступна только для частного дома';
  return null;
}

export const isGoalAllowed = (o: ObjectType, g: GoalType) => getGoalBlockReason(o, g) === null;
export const isFinanceAllowed = (o: ObjectType, g: GoalType, f: FinanceType) =>
  getFinanceBlockReason(o, g, f) === null;

export function filterRoadmap(
  filter: ScenarioFilter,
  stages: RoadmapStage[]
): ResolvedRoadmapStage[] {
  const activeTags = new Set<Tag>([filter.object, filter.goal, filter.finance]);
  const priorityOrder: Tag[] = [filter.finance, filter.goal, filter.object];

  return stages
    .map((stage) => {
      const visibleSteps: ResolvedRoadmapStep[] = stage.steps
        .filter((step) => evaluateCond(step.condition, activeTags))
        .map((step) => {
          const { condition: _cond, whyOverrides, ...rest } = step;
          let resolvedWhy = step.why;
          let activeOverrideTag: Tag | undefined;

          if (whyOverrides) {
            const matchedTag = priorityOrder.find((tag) => whyOverrides[tag] !== undefined);
            if (matchedTag && whyOverrides[matchedTag]) {
              resolvedWhy = whyOverrides[matchedTag]!;
              activeOverrideTag = matchedTag;
            }
          }

          return {
            ...rest,
            resolvedWhy,
            activeOverrideTag,
          };
        });

      return {
        id: stage.id,
        title: stage.title,
        goal: stage.goal,
        steps: visibleSteps,
      };
    })
    .filter((stage) => stage.steps.length > 0);
}

export function useFilteredRoadmap(
  filter: ScenarioFilter,
  stages: RoadmapStage[]
): ResolvedRoadmapStage[] {
  return useMemo(() => filterRoadmap(filter, stages), [filter, stages]);
}