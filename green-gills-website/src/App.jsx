import { useEffect, useState } from 'react';
import { database } from './firebase-config';
import { ref, onValue } from "firebase/database";
import './App.css';
import rfLogo from './assets/rf-logo.png';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function App() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const checkForHighTemperature = (rows) => {
    const highTempRow = rows.find(row => row.temp_fahrenheit >= 83);
    if (highTempRow && !toast.isActive('highTempToast')) {
      toast.warn(`High temperature alert: ${highTempRow.temp_fahrenheit}°F at ${highTempRow.timestamp}`, {
        toastId: 'highTempToast'
      });
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing the number of rows per page
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    const tempDataRef = ref(database, 'temperatureData');
    const unsubscribe = onValue(tempDataRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRows = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          loadedRows.push({
            id: key,
            ...data[key]
          });
        });
      }
      setRows(loadedRows);
      checkForHighTemperature(loadedRows);
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <>
      <ToastContainer />
      <div className='topPart'>
        <a href="https://www.renewablefarms.com/" target="_blank" rel="noopener noreferrer">
          <img src={rfLogo} className="logo" alt="RF Logo" />
        </a>
        <h1>Renewable Farms Data</h1>
      </div>

      <TableContainer component={Paper}>
        <Typography variant="h6" component="div" style={{ padding: '16px' }}>
          Temperature Data
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Timestamp</TableCell>
              <TableCell align="left">Celsius</TableCell>
              <TableCell align="left">Fahrenheit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.timestamp}</TableCell>
                <TableCell align="left">{row.temp_celsius}</TableCell>
                <TableCell align="left">{row.temp_fahrenheit}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[8, 16, 24, { label: 'All', value: -1 }]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );  
}

export default App;
