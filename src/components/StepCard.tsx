import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Stack,
  Link,
  LinearProgress,
} from '@mui/material';
import {
  InfoOutlined as InfoOutlinedIcon,
  TipsAndUpdatesOutlined as TipsAndUpdatesOutlinedIcon,
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

import type { ResolvedRoadmapStep } from '../types/navigator';
import { TAG_LABELS } from '../data/roadmapData';

interface StepCardProps {
  step: ResolvedRoadmapStep;
  completedItems: Set<string>;
  onToggleItem: (itemKey: string) => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  completedItems,
  onToggleItem,
}) => {
  const totalItems = step.checklist.length;
  const doneCount = step.checklist.filter((_, idx) =>
    completedItems.has(`${step.id}:${idx}`)
  ).length;
  const isStepCompleted = totalItems > 0 && doneCount === totalItems;
  const progressPercent = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: isStepCompleted ? 'primary.main' : 'divider',
        bgcolor: isStepCompleted ? '#FAFDF9' : 'background.paper',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
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
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {step.title}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {isStepCompleted && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Выполнено"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {doneCount} из {totalItems}
          </Typography>
        </Stack>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progressPercent}
        sx={{
          height: 5,
          borderRadius: 3,
          mb: 2,
          bgcolor: 'grey.100',
        }}
      />

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {step.description}
      </Typography>

      <Box
        sx={{
          p: 1.75,
          mb: 2,
          borderRadius: 2,
          bgcolor: '#F1F7EE',
          borderLeft: '4px solid',
          borderColor: 'primary.main',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
          <InfoOutlinedIcon sx={{ fontSize: 18, color: 'primary.dark' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark' }}>
            Почему это важно
          </Typography>
          {step.activeOverrideTag && (
            <Chip
              label={`для: ${TAG_LABELS[step.activeOverrideTag]}`}
              size="small"
              color="primary"
              sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
            />
          )}
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {step.resolvedWhy}
        </Typography>
      </Box>

      <Box sx={{ mb: step.recommendation ? 2 : 0 }}>
        <FormGroup>
          {step.checklist.map((itemText, idx) => {
            const itemKey = `${step.id}:${idx}`;
            const checked = completedItems.has(itemKey);
            return (
              <FormControlLabel
                key={itemKey}
                control={
                  <Checkbox
                    size="small"
                    checked={checked}
                    onChange={() => onToggleItem(itemKey)}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                        mt: '9px',
                        textDecoration: checked ? 'line-through' : 'none',
                        color: checked ? 'text.secondary' : 'text.primary',
                    }}
                    >
                    {itemText}
                  </Typography>
                }
                sx={{ alignItems: 'flex-start', my: 0.25 }}
              />
            );
          })}
        </FormGroup>
      </Box>

      {step.recommendation && (
        <Box
          sx={{
            p: 1.75,
            borderRadius: 2,
            bgcolor: '#FFFDF4',
            border: '1px solid #F3E3A3',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
            <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 20, color: '#B78103', mt: 0.2 }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: '#8C6200', display: 'block' }}
              >
                Рекомендуем
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {step.recommendation.text}
              </Typography>
            </Box>
          </Stack>

          {step.recommendation.link && (
            <Link
              href={step.recommendation.link}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'primary.dark',
                whiteSpace: 'nowrap',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Открыть ссылку
              <OpenInNewIcon sx={{ fontSize: 15 }} />
            </Link>
          )}
        </Box>
      )}
    </Paper>
  );
};