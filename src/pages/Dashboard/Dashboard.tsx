import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { OnboardingWebApi } from '../../api/onboardingWebApiClient';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import Overlay from '../../components/Overlay/Overlay';

const Dashboard = () => {
  const [trxCode, setTrxCode] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const mockResponse =
  {
    amount: '100,00 €',
    expirationDate: '03/10/2025',
    validity: '10 giorni',
    fiscalCode: 'RSSLNZ85T10H501Z'
  };

  const details = [
    { label: 'Importo', value: mockResponse.amount },
    { label: 'Da utilizzare entro il', value: mockResponse.expirationDate },
    { label: 'Durata del buono', value: mockResponse.validity },
    { label: 'Codice Fiscale', value: mockResponse.fiscalCode }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const initiativeId = '68c4449d0d8426093743d00e';
      try{
        const response = await OnboardingWebApi.getBarCode(initiativeId);
        setTrxCode(response.data?.trxCode);
      }catch(error){
        navigate(ROUTES.ERROR_PAGE, { state: { status: "UNKNOWN_ERROR"}})
      }finally{
        setIsLoading(false);
        console.log(trxCode)
      }
    }

    fetchData();
  }, [])
  
  if(isLoading) return <Overlay />

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          Panoramica
        </Typography>
        <Typography variant="body1" gutterBottom mt={2}>
          Da qui puoi visualizzare e scaricare il tuo buono sconto.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Dettagli del buono sconto
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={3}
          mt={2}
        >
          <Box flex={2}>
            <Card>
              <CardContent>
                <Box mt={2}>
                  {details.map((item, index) => (
                    <Box
                      key={index}
                      display="flex"
                      py={1}
                    >
                      <Typography
                        variant="body2"
                        width={'50%'}
                        pr={2}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={'bold'}
                        width={'40%'}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box mt={2}>
                  <ButtonNaked
                    color="primary"
                    size="medium"
                    endIcon={<OpenInNewIcon />}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Visualizza i punti vendita abilitati
                  </ButtonNaked>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box flex={1}>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
              <Box
                component="img"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAIAAADrOSKFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4REE1RDAxOEY2NTUxMUUzQjc1Mjg3QURFNjU1NEY4OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4REE1RDAxOUY2NTUxMUUzQjc1Mjg3QURFNjU1NEY4OCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhEQTVEMDE2RjY1NTExRTNCNzUyODdBREU2NTU0Rjg4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhEQTVEMDE3RjY1NTExRTNCNzUyODdBREU2NTU0Rjg4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+FhU0oQAABBtJREFUeNrs2j1v1GYAwPFzPwdCrWABsbZdkIIQClQCliK1GysjSARY2KEgQddWCfABupRWKggQARZgYOBtggDlK8Bq4reLH/ux73z0QBW/38Llzi9PHP/xYydJmqajliRJihfjT3veaetZJrq7rl1MM56eLQ9aZtDqPWvNdjB71ppm74N2MegH9199yx/5455ty4O+wfkNfuIGvxoBn5UIQYQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEJAhCBCQIQgQkCEIEIQoUMAIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEQIiBBECIgQRAiIEEYIIARHClyxJ09RRAFdCECEgwv+TN78fSsZ+WHqTv7l6LGk7ca+1fJKsvA22Vqy498qT+PZry4e7+H61MaxbZ8P3n59oDqf66NVfe1uDnGH80ePAUCmD3TyTH7rvbqfp7aP5y5MrrYXeLS9knyzdDZZ//duP2ct9x1/XliksXn7c3n5kX/m65XaC/T5bKreUr7hu7epifGzlktnYimVGo+V/h49/quPARCIcrjjhymbKk7g67xuh1k/W4nVs+WCDzS/LYJqR1EOtrTVNhLGAO/6j6R3/VMeByUxHB3v/4lHtq693/5RdMR78fS+cYV49lZ2gPx/evP7P7oNZSP+cv/F2tPrrgevZiVu/BDYtXMh+MtcO7+gZRLH90ckjC9VEdNfF0fKd8rJWevk029e2bxvrrj37YxR7f+D4pzoOmI7ORXklCaaL+bRtLHJZGM8Va9POjith+6Nq+lq/BjaveNnqjf1uLFkqLqe1a2bw/tDxTz4OmI7Oe0ZanJOLi82Tr3mDVDunw3vCCREGZ3nnfWl+8xab68YiqZaP3XPOMP7+44AIP432PVvznbCx2gOP3gir87vrLqvazqVwClppxbCx30njGTz+vntX3BPO3a0/z+WpbNk0fmp/+lx+rdizKXYPOd1t58quZP0eLy/w/kL/slv3X4tNI3/Z2bnGN9uzq9n15w87fvsy0/hbxwH3hPOfi2ZTsmpqt/Gksfb0v+8esu/paMcsNNhXfJlgOtq9fP3XEs3xDBh/73HAdPTT3ROGZ16ssdp5HH8QEv2dRGx6+S58qNqaqTYfqHQvvxZMYjfGM3D8nceBAfwBN/izNRAh8Bl9EGAAD6/8IysQqEIAAAAASUVORK5CYII="
                alt="barcode"
                width={'100%'}
                maxWidth={200}
                mb={2}
                border='1px solid #e0e0e0'
                padding={2}
              />
              <Button startIcon={<DownloadIcon />} variant="contained">Scarica codice</Button>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;