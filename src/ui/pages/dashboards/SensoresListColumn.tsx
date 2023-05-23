import {
  Card,
  Box,
  Typography,
  Avatar,
  Grid,
  alpha,
  useTheme,
  styled
} from '@mui/material';
import Label from 'src/ui/components/Label';
import Text from 'src/ui/components/Text';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import SpeedIcon from '@mui/icons-material/Speed';
import React, { useEffect, useState } from 'react';
import Transactions from '../database-table/DatabaseTable';
import { useNavigate } from 'react-router-dom';
import mqtt from 'mqtt';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(0, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

function SensoresListColumn() {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    fill: {
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    colors: [theme.colors.primary.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.primary.main],
      width: 3
    },
    legend: {
      show: false
    },
    labels: [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo'
    ],
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      tickAmount: 5
    },
    tooltip: {
      x: {
        show: true
      },
      marker: {
        show: false
      }
    }
  };

  const chart1Data = [
    {
      name: 'Temperatura',
      data: [35, 37, 38, 36, 38, 36, 38]
    }
  ];

  const chart2Data = [
    {
      name: 'Presión',
      data: [1300, 1600, 1400, 2000, 800, 1100, 2000]
    }
  ];

  const chart3Data = [
    {
      name: 'Humedad',
      data: [51, 41, 22, 42, 31, 51, 31]
    }
  ];

  const [openTable, setOpenTable] = useState(false);
  const [sensorName, setSensorName] = useState<String>('');

  const navigate = useNavigate();

  const handleOnClick = (name: String) => {
    setOpenTable(!openTable);
    setSensorName(name);
    navigate(`db-t/${name}`);
  };

  const [sensorValue, setSensorValue] = useState('');

  useEffect(() => {
    const connectToMqttBroker = async () => {
      try {
        const caCertResponse = await fetch('src\cert\Amazon-root-CA-1.pem');
        const caCert = await caCertResponse.text();

        const clientCertResponse = await fetch('src\cert\certificate.pem.crt');
        const clientCert = await clientCertResponse.text();

        const privateKeyResponse = await fetch('src\cert\private.pem.key');
        const privateKey = await privateKeyResponse.text();

        const client = mqtt.connect('wss://agg46jy6wee7t-ats.iot.eu-west-1.amazonaws.com:8883/mqtt', {
          clientId: 'your-client-id',
          ca: caCert,
          cert: clientCert,
          key: privateKey,
          rejectUnauthorized: false
        });

        client.on('connect', () => {
          client.subscribe('sensor/value');
        });

        client.on('message', (topic, message) => {
          setSensorValue(message.toString());
        });

        client.on('error', (error) => {
          console.error('MQTT error:', error);
        });

        // Cleanup function
        return () => {
          client.end();
        };
      } catch (error) {
        console.error('Error connecting to MQTT broker:', error);
      }
    };

    connectToMqttBroker();
  }, []);
  return !openTable ? (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >
      <Grid item md={4} xs={12}>
        {/* temperatura */}
        <Card
          sx={{
            overflow: 'visible',
            cursor: 'pointer'
          }}
          onClick={() => handleOnClick('temperature')}
        >
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper>
                <ThermostatIcon color="primary" />
              </AvatarWrapper>
              <Box>
                <Typography variant="h4" noWrap>
                  Temperatura
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  ºC
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
               {sensorValue}
              </Typography>
              <Text color="success">
                <b>+12.5%</b>
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <Label color="success">23,5º</Label>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 1
                }}
              >
                ayer a esta hora
              </Typography>
            </Box>
          </Box>
          <Chart
            options={chartOptions}
            series={chart1Data}
            type="area"
            height={200}
          />
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        {/* humedad */}
        <Card
          sx={{
            overflow: 'visible',
            cursor: 'pointer'
          }}
          onClick={() => handleOnClick('humidity')}
        >
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper>
                <InvertColorsIcon color="primary" />
              </AvatarWrapper>
              <Box>
                <Typography variant="h4" noWrap>
                  Humedad
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  %
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                34,4%
              </Typography>
              <Text color="error">
                <b>-12.5%</b>
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <Label color="error">44,5%</Label>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 1
                }}
              >
                ayer a esta hora
              </Typography>
            </Box>
          </Box>
          <Chart
            options={chartOptions}
            series={chart3Data}
            type="area"
            height={200}
          />
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        {/* presion */}
        <Card
          sx={{
            overflow: 'visible',
            cursor: 'pointer'
          }}
          onClick={() => handleOnClick('pressure')}
        >
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper>
                <SpeedIcon color="primary" />
              </AvatarWrapper>
              <Box>
                <Typography variant="h4" noWrap>
                  Presión
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  mbar
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                999 mbar
              </Typography>
              <Text color="warning">
                <b>0%</b>
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <Label color="warning">999 mbar</Label>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 1
                }}
              >
                ayer a esta hora
              </Typography>
            </Box>
          </Box>
          <Chart
            options={chartOptions}
            series={chart2Data}
            type="area"
            height={200}
          />
        </Card>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
}

export default SensoresListColumn;
