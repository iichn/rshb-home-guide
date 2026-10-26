import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

import type {
  FinanceType,
  GoalType,
  ObjectType,
  ScenarioFilter,
} from '../types/navigator';
import { PRESETS, TAG_LABELS } from '../data/roadmapData';
import { isFinanceAllowed, isGoalAllowed } from '../hooks/useFilteredRoadmap';

interface ScenarioConfiguratorProps {
  filter: ScenarioFilter;
  onChange: (nextFilter: ScenarioFilter) => void;
  totalStages: number;
  totalSteps: number;
}

const OBJECT_OPTIONS: ObjectType[] = ['apartment', 'house', 'plot'];
const GOAL_OPTIONS: GoalType[] = ['ready', 'build', 'repair'];
const FINANCE_OPTIONS: FinanceType[] = ['rural', 'standard', 'own'];

export const ScenarioConfigurator: React.FC<ScenarioConfiguratorProps> = ({
  filter,
  onChange,
  totalStages,
  totalSteps,
}) => {
  const activePreset = PRESETS.find(
    (p) =>
      p.object === filter.object &&
      p.goal === filter.goal &&
      p.finance === filter.finance
  );

  const handleObjectChange = (
    _: React.MouseEvent<HTMLElement>,
    nextObject: ObjectType | null
  ) => {
    if (!nextObject) return;

    let nextGoal = filter.goal;
    if (!isGoalAllowed(nextObject, nextGoal)) {
      nextGoal = 'ready';
    }

    let nextFinance = filter.finance;
    if (!isFinanceAllowed(nextObject, nextGoal, nextFinance)) {
      nextFinance = 'standard';
    }

    onChange({
      object: nextObject,
      goal: nextGoal,
      finance: nextFinance,
    });
  };

  const handleGoalChange = (
    _: React.MouseEvent<HTMLElement>,
    nextGoal: GoalType | null
  ) => {
    if (!nextGoal) return;

    let nextFinance = filter.finance;
    if (!isFinanceAllowed(filter.object, nextGoal, nextFinance)) {
      nextFinance = nextGoal === 'repair' ? 'own' : 'standard';
    }

    onChange({
      ...filter,
      goal: nextGoal,
      finance: nextFinance,
    });
  };

  const handleFinanceChange = (
    _: React.MouseEvent<HTMLElement>,
    nextFinance: FinanceType | null
  ) => {
    if (!nextFinance) return;
    onChange({
      ...filter,
      finance: nextFinance,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        mb: 3,
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
          <AutoAwesomeOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Быстрые сценарии:
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {PRESETS.map((preset) => {
            const isSelected = activePreset?.id === preset.id;
            return (
              <Chip
                key={preset.id}
                label={`${preset.id}. ${preset.name}`}
                clickable
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                onClick={() =>
                  onChange({
                    object: preset.object,
                    goal: preset.goal,
                    finance: preset.finance,
                  })
                }
                sx={{
                  fontWeight: isSelected ? 600 : 500,
                  borderRadius: 2,
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}
      >
        <Box>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 1 }}>
            <HomeWorkOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              1. Тип объекта
            </Typography>
          </Stack>
          <ToggleButtonGroup
            fullWidth
            exclusive
            size="small"
            color="primary"
            value={filter.object}
            onChange={handleObjectChange}
          >
            {OBJECT_OPTIONS.map((obj) => (
              <ToggleButton
                key={obj}
                value={obj}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                {TAG_LABELS[obj]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 1 }}>
            <FlagOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              2. Цель
            </Typography>
          </Stack>
          <ToggleButtonGroup
            fullWidth
            exclusive
            size="small"
            color="primary"
            value={filter.goal}
            onChange={handleGoalChange}
          >
            {GOAL_OPTIONS.map((goal) => {
              const allowed = isGoalAllowed(filter.object, goal);
              const button = (
                <ToggleButton
                  key={goal}
                  value={goal}
                  disabled={!allowed}
                  sx={{ textTransform: 'none', fontWeight: 500, flex: 1 }}
                >
                  {TAG_LABELS[goal]}
                </ToggleButton>
              );

              return allowed ? (
                button
              ) : (
                <Tooltip
                  key={goal}
                  title="Для земельного участка сценарий ремонта неприменим"
                  arrow
                >
                  <span style={{ flex: 1, display: 'flex' }}>{button}</span>
                </Tooltip>
              );
            })}
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 1 }}>
            <AccountBalanceWalletOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              3. Финансирование
            </Typography>
          </Stack>
          <ToggleButtonGroup
            fullWidth
            exclusive
            size="small"
            color="primary"
            value={filter.finance}
            onChange={handleFinanceChange}
          >
            {FINANCE_OPTIONS.map((fin) => {
              const allowed = isFinanceAllowed(filter.object, filter.goal, fin);
              const tooltipText =
                filter.object !== 'house'
                  ? 'В рамках MVP сельская ипотека доступна только для частного дома (ИЖС)'
                  : 'Сельская ипотека не выдаётся на ремонт существующего жилья';

              const button = (
                <ToggleButton
                  key={fin}
                  value={fin}
                  disabled={!allowed}
                  sx={{ textTransform: 'none', fontWeight: 500, flex: 1 }}
                >
                  {TAG_LABELS[fin]}
                </ToggleButton>
              );

              return allowed ? (
                button
              ) : (
                <Tooltip key={fin} title={tooltipText} arrow>
                  <span style={{ flex: 1, display: 'flex' }}>{button}</span>
                </Tooltip>
              );
            })}
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: '1px dashed',
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Активные теги маршрута:
          </Typography>
          <Chip size="small" label={TAG_LABELS[filter.object]} variant="outlined" />
          <Chip size="small" label={TAG_LABELS[filter.goal]} variant="outlined" />
          <Chip size="small" label={TAG_LABELS[filter.finance]} variant="outlined" />
        </Stack>

        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Сформировано: {totalStages} этапов · {totalSteps} шагов
        </Typography>
      </Box>
    </Paper>
  );
};