import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Chip,
  Stack,
  Container,
} from '@mui/material';

import type { ScenarioFilter } from './types/navigator';
import { ROADMAP_STAGES } from './data/roadmapData';
import { useFilteredRoadmap, isGoalAllowed, isFinanceAllowed } from './hooks/useFilteredRoadmap';
import { ScenarioConfigurator } from './components/ScenarioConfigurator';
import { RoadmapTimeline } from './components/RoadmapTimeline';

const rshbTheme = createTheme({
  palette: {
    primary: {
      main: '#428B26',
      dark: '#2E641A',
      light: '#68AC4C',
    },
    background: {
      default: '#F5F7F4',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
});

const STORAGE_KEY_FILTER = 'rshb_navigator_filter_v1';
const STORAGE_KEY_COMPLETED = 'rshb_navigator_completed_v1';

export function App() {
  const [filter, setFilter] = useState<ScenarioFilter>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILTER);
      if (saved) {
        const p = JSON.parse(saved) as ScenarioFilter;
        if (
            ['apartment', 'house', 'plot'].includes(p.object) &&
            ['ready', 'build', 'repair'].includes(p.goal) &&
            ['rural', 'standard', 'own'].includes(p.finance) &&
            isGoalAllowed(p.object, p.goal) &&
            isFinanceAllowed(p.object, p.goal, p.finance)
        ) return p;
        }
    } catch {
      // ignore storage errors
    }
    return { object: 'house', goal: 'build', finance: 'rural' };
  });

  const [completedItems, setCompletedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (saved) return new Set(JSON.parse(saved) as string[]);
    } catch {
      // ignore storage errors
    }
    return new Set();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FILTER, JSON.stringify(filter));
    } catch {
      // ignore storage errors
    }
  }, [filter]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_COMPLETED,
        JSON.stringify(Array.from(completedItems))
      );
    } catch {
      // ignore storage errors
    }
  }, [completedItems]);

  const stages = useFilteredRoadmap(filter, ROADMAP_STAGES);
  const totalSteps = stages.reduce((acc, stage) => acc + stage.steps.length, 0);

  const handleToggleItem = (itemKey: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  const handleResetProgress = () => {
    setCompletedItems(new Set());
  };

  return (
    <ThemeProvider theme={rshbTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
              <Chip
                label="Своё Жильё · РСХБ"
                color="primary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
              <Typography variant="caption" color="text.secondary">
                Интерактивный навигатор клиента
              </Typography>
            </Stack>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
              Путь к своему дому
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Выберите параметры вашего сценария — навигатор автоматически адаптирует этапы,
              список документов и рекомендации банка.
            </Typography>
          </Box>

          <ScenarioConfigurator
            filter={filter}
            onChange={setFilter}
            totalStages={stages.length}
            totalSteps={totalSteps}
          />

          <RoadmapTimeline
            stages={stages}
            completedItems={completedItems}
            onToggleItem={handleToggleItem}
            onResetProgress={handleResetProgress}
          />
          <Typography variant="caption" sx={{ display: 'block', mt: 4, color: 'text.secondary' }}>
            Прототип. Условия программ и лимиты вычетов сверяйте на сайтах банка и ФНС. Не является офертой.
            </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;