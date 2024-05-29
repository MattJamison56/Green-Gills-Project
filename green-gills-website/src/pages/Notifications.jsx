import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNotificationContext } from '../NotificationContext';

const Notifications = () => {
  const { notifications, removeNotification } = useNotificationContext();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pond</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>{notification.pond}</TableCell>
              <TableCell>{notification.issue}</TableCell>
              <TableCell>
                <IconButton onClick={() => removeNotification(notification.id)}>
                  <CheckIcon color="primary" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Notifications;
