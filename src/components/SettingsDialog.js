import React, { useReducer } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SettingsButton from './SettingsButton';

function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    appId: '',
    apiKey: '',
    oreIdUrl: '',
    backgroundColor: '',
    chainNetwork: '',
  });

  const { ore } = props;

  function handleClickOpen() {
    const settings = localStorage.getItem('settings');

    if (settings && settings.length) {
      setValues(JSON.parse(settings));
    }

    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSave() {
    localStorage.setItem('settings', JSON.stringify(values));

    ore.reload();

    setOpen(false);
  }

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div>
      <SettingsButton onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Settings</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>To subscribe to this website, please enter your email address here. We will send updates occasionally.</DialogContentText> */}
          <TextField autoFocus margin="dense" value={values.appId} label="App ID" type="text" fullWidth onChange={handleChange('appId')} />
          <TextField margin="dense" value={values.apiKey} label="API Key" type="text" fullWidth onChange={handleChange('apiKey')} />
          <TextField margin="dense" value={values.oreIdUrl} label="ORE ID Url" type="text" fullWidth onChange={handleChange('oreIdUrl')} />
          <TextField margin="dense" value={values.backgroundColor} label="Background Color" type="text" fullWidth onChange={handleChange('backgroundColor')} />
          <TextField margin="dense" value={values.chainNetwork} label="Chain Network" type="text" fullWidth onChange={handleChange('chainNetwork')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
