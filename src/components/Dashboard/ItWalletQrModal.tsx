import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ItWalletQrContent from './ItWalletQrContent';

type Props = {
  open: boolean;
  onClose: () => void;
  deepLink: string;
};

const ItWalletQrModal = ({ open, onClose, deepLink }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogContent sx={{ textAlign: 'center', pt: 5, pb: 4 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <ItWalletQrContent deepLink={deepLink} />
      </DialogContent>
    </Dialog>
  );
};

export default ItWalletQrModal;