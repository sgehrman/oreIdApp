import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import CogIcon from '@material-ui/icons/Settings';

const styles = (theme) => ({
  fab: {
    margin: theme.spacing.unit,
    position: 'fixed',
    top: 4,
    left: 4
  }
});

function FloatingActionButtons(props) {
  const { classes, onClick } = props;

  return (
    <div>
      <Fab color="primary" aria-label="Add" className={classes.fab} onClick={onClick}>
        <CogIcon />
      </Fab>
    </div>
  );
}

export default withStyles(styles)(FloatingActionButtons);
