import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PendingOutlined as PendingOutlinedIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';

import type { ResolvedRoadmapStage } from '../types/navigator';
import { StepCard } from './StepCard';

interface RoadmapTimelineProps {
  stages: ResolvedRoadmapStage[];
  completedItems: Set<string>;
  onToggleItem: (itemKey: string) => void;
  onResetProgress: () => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  stages,
  completedItems,
  onToggleItem,
  onResetProgress,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string | 'all'>('all');

  useEffect(() => {
    if (
      selectedStageId !== 'all' &&
      !stages.some((stage) => stage.id === selectedStageId)
    ) {
      setSelectedStageId('all');
    }
  }, [stages, selectedStageId]);

  const allChecklistKeys = stages.flatMap((stage) =>
    stage.steps.flatMap((step) =>
      step.checklist.map((_, idx) => `${step.id}:${idx}`)
    )
  );

  const totalChecklistCount = allChecklistKeys.length;
  const completedChecklistCount = allChecklistKeys.filter((k) =>
    completedItems.has(k)
  ).length;
  const overallProgress =
    totalChecklistCount > 0
      ? Math.round((completedChecklistCount / totalChecklistCount) * 100)
      : 0;

  const visibleStages =
    selectedStageId === 'all'
      ? stages
      : stages.filter((s) => s.id === selectedStageId);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 1.5,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Общий прогресс по вашему маршруту
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Отмечайте выполненные пункты в карточках шагов — прогресс пересчитывается автоматически
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Chip
              label={`${completedChecklistCount} из ${totalChecklistCount} пунктов (${overallProgress}%)`}
              color={overallProgress === 100 ? 'primary' : 'default'}
              sx={{ fontWeight: 700 }}
            />
            {completedChecklistCount > 0 && (
              <Button
                size="small"
                color="inherit"
                startIcon={<RestartAltIcon />}
                onClick={onResetProgress}
                sx={{ textTransform: 'none', color: 'text.secondary' }}
              >
                Сбросить
              </Button>
            )}
          </Stack>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={overallProgress}
          sx={{ height: 10, borderRadius: 5, mb: 2.5 }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="Все этапы маршрута"
            clickable
            color={selectedStageId === 'all' ? 'primary' : 'default'}
            variant={selectedStageId === 'all' ? 'filled' : 'outlined'}
            onClick={() => setSelectedStageId('all')}
            sx={{ fontWeight: 600 }}
          />
          {stages.map((stage) => {
            const stageKeys = stage.steps.flatMap((step) =>
              step.checklist.map((_, idx) => `${step.id}:${idx}`)
            );
            const stageDone = stageKeys.filter((k) => completedItems.has(k)).length;
            const isComplete = stageKeys.length > 0 && stageDone === stageKeys.length;
            const isInProgress = stageDone > 0 && !isComplete;

            const icon = isComplete ? (
              <CheckCircleIcon fontSize="small" />
            ) : isInProgress ? (
              <PendingOutlinedIcon fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" />
            );

            return (
              <Chip
                key={stage.id}
                icon={icon}
                label={`${stage.title} (${stageDone}/${stageKeys.length})`}
                clickable
                color={selectedStageId === stage.id ? 'primary' : 'default'}
                variant={selectedStageId === stage.id ? 'filled' : 'outlined'}
                onClick={() => setSelectedStageId(stage.id)}
                sx={{ fontWeight: 500 }}
              />
            );
          })}
        </Box>
      </Paper>

      <Stack spacing={4}>
        {visibleStages.map((stage, stageIdx) => {
          const stageKeys = stage.steps.flatMap((step) =>
            step.checklist.map((_, idx) => `${step.id}:${idx}`)
          );
          const stageDone = stageKeys.filter((k) => completedItems.has(k)).length;
          const isStageComplete = stageKeys.length > 0 && stageDone === stageKeys.length;

          return (
            <Box
              key={stage.id}
              sx={{
                position: 'relative',
                pl: { xs: 2, md: 3.5 },
                borderLeft: '3px solid',
                borderColor: isStageComplete ? 'primary.main' : 'grey.300',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: -11,
                  top: 0,
                  width: 19,
                  height: 19,
                  borderRadius: '50%',
                  bgcolor: isStageComplete ? 'primary.main' : 'background.paper',
                  border: '3px solid',
                  borderColor: isStageComplete ? 'primary.main' : 'grey.400',
                }}
              />

              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {stage.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={`Шагов: ${stage.steps.length}`}
                    variant="outlined"
                  />
                  {stageIdx === 0 && selectedStageId === 'all' && (
                    <Chip
                      size="small"
                      label="Старт маршрута"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Цель этапа: {stage.goal}
                </Typography>
              </Box>

              <Stack spacing={2}>
                {stage.steps.map((step) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    completedItems={completedItems}
                    onToggleItem={onToggleItem}
                  />
                ))}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};