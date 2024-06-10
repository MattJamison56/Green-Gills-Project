/* eslint-disable react/prop-types */
import { useState } from 'react';
import PondSelect from '../components/pondselect/pondselect';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import DataChart from '../components/datachart/datachart';
import DataTable from '../components/datatable/datatable';
import { Container } from '@mui/material';
import DataBlock from '../components/datablock/datablock';
import { useThresholdContext } from '../ThresholdContext';

function Statistics({ data }) {
  const [selectedPond, setSelectedPond] = useState('');
  const { tempThreshold } = useThresholdContext();

  // For now, forced set statuses for all ponds
  // TODO: dynamic pond statuses based on thresholds or if sensors not working
  const pondStatuses = {
    'Pond 1': 'ok',
    'Pond 2': 'ok',
    'Pond 3': 'ok',
    'Pond 4': 'ok',
    'Pond 5': 'ok',
    'Pond 6': 'ok',
    'Pond 7': 'ok',
    'Pond 8': 'ok',
    'Pond 9': 'ok',
    'Pond 10': 'ok'
  };

  // For the big dot next to the pond choice menu
  const getOverallStatus = () => {
    const statuses = Object.values(pondStatuses);
    if (statuses.includes('error')) return 'red';
    if (statuses.includes('warning')) return 'yellow';
    return 'green';
  };
  const overallStatus = getOverallStatus();

  const handleSelectChange = (event) => {
    setSelectedPond(event.target.value);
  };

  // Table Column labels
  // TODO: Set them for each type of reading
  const tempColumns = [
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'temp_celsius', label: 'Celsius' },
    { id: 'temp_fahrenheit', label: 'Fahrenheit' }
  ];

  return (
    <div>
      <h2>History</h2>
        <PondSelect
            selectedPond={selectedPond}
            handleSelectChange={handleSelectChange}
            pondStatuses={pondStatuses}
            overallStatus={overallStatus}
        />
        <Container>
            <Grid container spacing={3} justifyContent="center">
                {/* DataTable */}
                <Grid item xs={12} md={10} lg={10}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <DataTable
                            tablename="Temperature"
                            columns={tempColumns}
                            dataRef="temperatureData"
                            data={data.Temperature}
                            tempThreshold={tempThreshold}
                        />
                    </Paper>
                </Grid>

                {/* DataTable */}
                <Grid item xs={12} md={10} lg={10}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <DataTable
                            tablename="pH"
                            columns={tempColumns}
                            dataRef="temperatureData"
                            data={data.Temperature}
                            tempThreshold={tempThreshold}
                        />
                    </Paper>
                </Grid>

                {/* DataTable */}
                <Grid item xs={12} md={10} lg={10}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <DataTable
                            tablename="TDS"
                            columns={tempColumns}
                            dataRef="temperatureData"
                            data={data.Temperature}
                            tempThreshold={tempThreshold}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </div>
  );
}

export default Statistics;
