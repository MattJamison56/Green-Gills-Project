/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { database } from '../../firebase-config';
import { ref, onValue } from "firebase/database";
import "./datatable.css";

const DataTable = ({ tablename, columns, dataRef, onDataLoaded }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [rows, setRows] = useState([]);

  const checkForHighTemperature = (rows) => {
    if (tablename === "Temperature") {
      const highTempRow = rows.find(row => row.temp_fahrenheit >= 83);
      if (highTempRow && !toast.isActive('highTempToast')) {
        toast.warn(`High temperature alert: ${highTempRow.temp_fahrenheit}°F at ${highTempRow.timestamp}`, {
          toastId: 'highTempToast'
        });
      }
    }
  };

  useEffect(() => {
    const tempDataRef = ref(database, dataRef);
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
      onDataLoaded(loadedRows);
    });

    return () => unsubscribe();
  }, [dataRef]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing the number of rows per page
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className='datatable'>
      <TableContainer component={Paper}>
        <Typography variant="h6" component="div" style={{ padding: '16px' }}>
          {tablename}
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align="left">{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id} align="left">{row[column.id]}</TableCell>
                ))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length} />
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
    </div>
  );
};

export default DataTable;
