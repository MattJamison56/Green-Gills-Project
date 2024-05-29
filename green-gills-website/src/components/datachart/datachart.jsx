/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Box } from '@mui/material';

// Uses the data and keys to make a chart
// Already dynamic woo!!!
const DataChart = ({ name, data, dataKeyX, dataKeyY }) => {
  return (
    <Box sx={{ width: 'auto', height: 400, margin: 5}}>
      <Typography variant="h6" align="center" gutterBottom>
        {name}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={300}
          height={200}
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={dataKeyX} 
            tick={false} 
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKeyY} stroke="#175616" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DataChart;
