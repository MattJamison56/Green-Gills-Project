import { useState, useContext } from 'react';
import PondSelect from '../components/pondselect/pondselect';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import DataChart from '../components/datachart/datachart';
import DataTable from '../components/datatable/datatable';
import { Container } from '@mui/material';
import DataBlock from '../components/datablock/datablock';
import { ThresholdContext } from '../ThresholdContext';

function DashboardPage() {
  const [selectedPond, setSelectedPond] = useState('');
  const [data, setData] = useState([]);
  const { tempThreshold } = useContext(ThresholdContext);

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


  const tempColumns = [
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'temp_celsius', label: 'Celsius' },
    { id: 'temp_fahrenheit', label: 'Fahrenheit' }
  ];


  return (
    <div>
        <PondSelect
            selectedPond={selectedPond}
            handleSelectChange={handleSelectChange}
            pondStatuses={pondStatuses}
            overallStatus={overallStatus}
        />
        <Container>
            <Grid container spacing={3} justifyContent="center">
                {/* Chart */}
                <Grid item xs={12} md={8} lg={8}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignContent: 'center',
                            justifyContent: 'center'
                        }}
                        >
                        <DataChart name="Temperature" data={data} dataKeyX="timestamp" dataKeyY="temp_fahrenheit" />
                    </Paper>
                </Grid>
                    
                <Grid item xs={12} md={4} lg={4}>
                        <DataBlock name="Temperature" data={data}></DataBlock>
                </Grid>

                {/* Temp Data */}
                <Grid item xs={12} md={10} lg={10}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <DataTable
                        tablename="Temperature"
                        columns={tempColumns}
                        dataRef="temperatureData"
                        onDataLoaded={setData}
                        tempThreshold={tempThreshold}
                    />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </div>
  );
}

export default DashboardPage;
