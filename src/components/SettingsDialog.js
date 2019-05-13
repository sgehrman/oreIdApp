import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SettingsButton from './SettingsButton';

function SettingsDialog(props) {
  const { ore, model } = props;

  const [open, setOpen] = React.useState(false);

  function currentENV() {
    return {
      appId: ore.env().appId,
      apiKey: ore.env().apiKey,
      oreIdUrl: ore.env().oreIdUrl,
      backgroundColor: ore.env().backgroundColor,
      chainNetwork: ore.env().chainNetwork,
    };
  }

  const [values, setValues] = React.useState(currentENV());

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSave() {
    ore.saveSettings(JSON.stringify(values));
    ore.reload();

    setOpen(false);
  }

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheckChange = () => (event) => {
    model.prod = event.target.checked;

    localStorage.setItem('prod', event.target.checked);

    ore.reload();
    setValues({ ...currentENV() });
  };

  return (
    <div>
      <SettingsButton onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Settings</DialogTitle>
        <DialogContent>
          <FormControlLabel control={<Checkbox checked={model.prod} onChange={handleCheckChange()} />} label="Production" />

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

export default SettingsDialog;
