import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';

import type { ScenarioFilter } from './types/navigator';
import { ROADMAP_STAGES } from './data/roadmapData';
import { useFilteredRoadmap } from './hooks/useFilteredRoadmap';
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

export function App() {
  const [filter, setFilter] = useState<ScenarioFilter>({
    object: 'house',
    goal: 'build',
    finance: 'rural',
  });

  const [completedItems, setCompletedItems] = useState<Set<string>>(() => new Set());

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
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
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
            <Typography variant="h4" fontWeight={800} gutterBottom>
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
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;