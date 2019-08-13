import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Utils from '../js/utils';

export default function JSONDialog(props) {
  const { actionCallback, jsonData, title } = props;
  const [open, setOpen] = useState(false);

  const showDialog = (jsonData !== null && (typeof jsonData === 'object'));
  if (showDialog !== open) {
    setOpen(showDialog);
  }

  let jsonView = null;
  if (jsonData) {
    const newData = JSON.parse(JSON.stringify(jsonData));

    // expand the jwt token
    if (newData && newData.jwtToken) {
      newData.jwtTokenDecoded = Utils.decodeJWT(newData.jwtToken);
    }

    jsonView = (
      <ReactJson
        style={{ padding: '14px 10px', fontSize: '.8em' }}
        src={newData}
        enableClipboard={false}
        onAdd={false}
        onDelete={false}
        displayDataTypes={false}
        displayObjectSize={false}
        indentWidth={2}
        iconStyle="triangle"
        theme="solarized"
      />
    );
  }

  function handleClose() {
    actionCallback('close');
  }

  const mainStyle = {
    marginTop: '16px'
  };

  let dialogTitle = 'Results';
  if (title && title.length > 0) {
    dialogTitle = title;
  }

  return (
    <div style={mainStyle}>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          {jsonView}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>

        </DialogActions>
      </Dialog>
    </div>
  );
}
